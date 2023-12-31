﻿using api.Entities;
using api.Models;
using api.Repositories;
using Microsoft.AspNetCore.Mvc;
using NLog.Filters;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System.Security.Principal;
using System.Linq;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DashboardController : BaseController
    {
        private readonly IUserRepository _userRepository;
        private readonly IAccountRepository _accountRepository;
        private readonly ICurrencyRepository _currencyRepository;
        private readonly IPortfolioRepository _portfolioRepository;

        public DashboardController(
            IUserRepository userRepository,
            IAccountRepository accountRepository,
            ICurrencyRepository currencyRepository,
            IPortfolioRepository portfolioRepository
        )
        {
            _userRepository =
                userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _accountRepository =
                accountRepository ?? throw new ArgumentNullException(nameof(accountRepository));
            _currencyRepository =
                currencyRepository ?? throw new ArgumentNullException(nameof(currencyRepository));
            _portfolioRepository =
                portfolioRepository ?? throw new ArgumentNullException(nameof(portfolioRepository));
        }

        [HttpGet("OverviewCards")]
        public ActionResult GetOverviewCards([FromQuery] DashboardFilterModel filter)
        {
            if (IsFilterInvalid(filter))
                return BadRequest(ModelState);

            List<Account> accounts = GetAccounts(filter);
            List<Currency> rates = _currencyRepository.GetRates(filter.BaseCurrency, accounts);

            DashboardNumberCardModel all = new DashboardNumberCardModel();
            DashboardNumberCardModel credit = new DashboardNumberCardModel();
            DashboardNumberCardModel debit = new DashboardNumberCardModel();

            foreach (Account account in accounts)
            {
                decimal rate = GetRate(rates, account.Currency, filter.BaseCurrency);

                all.Current += account.Transactions.Sum(x => x.Amount) * (1 / rate);
                all.Previous +=
                    account.Transactions.Where(x => x.Date < filter.From).Sum(x => x.Amount)
                    * (1 / rate);
                credit.Current += GetAccountTransactionTotal(
                    account,
                    filter.From,
                    filter.To,
                    TranType.Credit,
                    rate
                );
                credit.Previous += GetAccountTransactionTotal(
                    account,
                    filter.FromPreviousPeriod,
                    filter.ToPreviousPeriod,
                    TranType.Credit,
                    rate
                );
                debit.Current += Math.Abs(
                    GetAccountTransactionTotal(
                        account,
                        filter.From,
                        filter.To,
                        TranType.Debit,
                        rate
                    )
                );
                debit.Previous += Math.Abs(
                    GetAccountTransactionTotal(
                        account,
                        filter.FromPreviousPeriod,
                        filter.ToPreviousPeriod,
                        TranType.Debit,
                        rate
                    )
                );
            }

            return Ok(new List<DashboardNumberCardModel> { all, credit, debit });
        }

        private decimal GetAccountTransactionTotal(
            Account account,
            DateOnly from,
            DateOnly to,
            TranType tranType,
            decimal rate
        )
        {
            return account.Transactions
                    .Where(x => x.Type == tranType && x.Date >= from && x.Date <= to)
                    .Sum(x => x.Amount) * (1 / rate);
        }

        [HttpGet("TotalByCard")]
        public ActionResult GetTotalByCard([FromQuery] DashboardFilterModel filter)
        {
            if (IsFilterInvalid(filter))
                return BadRequest(ModelState);

            List<Account> accounts = GetAccounts(filter);
            List<Currency> rates = _currencyRepository.GetRates(filter.BaseCurrency, accounts);

            List<DashboarNameValueCardModel> data = new List<DashboarNameValueCardModel>();
            foreach (Account account in accounts)
            {
                decimal rate = GetRate(rates, account.Currency, filter.BaseCurrency);

                data.AddRange(
                    account.Transactions
                        .Where(
                            x =>
                                x.Date >= filter.From
                                && x.Date <= filter.To
                                && !string.IsNullOrEmpty(x.CardNo)
                        )
                        .GroupBy(x => x.CardNo)
                        .Select(
                            y =>
                                new DashboarNameValueCardModel
                                {
                                    Name = y.First().CardNo,
                                    Value = y.Sum(z => z.Amount) * -1 * (1 / rate)
                                }
                        )
                        .ToList()
                );
            }

            return Ok(data.OrderByDescending(x => x.Value));
        }

        [HttpGet("HighestSpendByVendor")]
        public IActionResult GetHighestSpend([FromQuery] DashboardFilterModel filter)
        {
            if (IsFilterInvalid(filter))
                return BadRequest(ModelState);

            List<Account> accounts = GetAccounts(filter);
            List<Currency> rates = _currencyRepository.GetRates(filter.BaseCurrency, accounts);
            List<DashboarNameValueCardModel> data = new List<DashboarNameValueCardModel>();

            List<string> accountCurrencies = accounts.Select(x => x.Currency).Distinct().ToList();
            foreach (string currency in accountCurrencies)
            {
                decimal rate = GetRate(rates, currency, filter.BaseCurrency);

                data.AddRange(
                    accounts
                        .Where(x => x.Currency == currency)
                        .SelectMany(y => y.Transactions)
                        .Where(
                            z =>
                                z.Date >= filter.From
                                && z.Date <= filter.To
                                && z.Type == TranType.Debit
                        )
                        .GroupBy(z => z.Description)
                        .Select(
                            a =>
                                new DashboarNameValueCardModel
                                {
                                    Name = a.First().Description,
                                    Value = Math.Abs(a.Sum(b => b.Amount * (1 / rate))),
                                }
                        )
                        .ToList()
                );
            }

            return Ok(
                data.GroupBy(x => x.Name)
                    .Select(
                        y =>
                            new DashboarNameValueCardModel
                            {
                                Name = y.First().Name,
                                Value = y.Sum(z => z.Value)
                            }
                    )
                    .OrderByDescending(a => a.Value)
                    .Take(30)
                    .ToList()
            );
        }

        [HttpGet("ExpenseBreakdown")]
        public ActionResult GetExpenseBreakdown([FromQuery] DashboardFilterModel filter)
        {
            if (IsFilterInvalid(filter))
                return BadRequest(ModelState);

            List<Account> accounts = GetAccounts(filter);
            List<Currency> rates = _currencyRepository.GetRates(filter.BaseCurrency, accounts);
            List<DashboarNameValueCardModel> data = new List<DashboarNameValueCardModel>();

            List<string> accountCurrencies = accounts.Select(x => x.Currency).Distinct().ToList();
            foreach (string currency in accountCurrencies)
            {
                decimal rate = GetRate(rates, currency, filter.BaseCurrency);

                data.AddRange(
                    accounts
                        .Where(x => x.Currency == currency)
                        .SelectMany(y => y.Transactions)
                        .Where(
                            z =>
                                z.Date >= filter.From
                                && z.Date <= filter.To
                                && z.Type == TranType.Debit
                        )
                        .GroupBy(z => z.Category)
                        .Select(
                            a =>
                                new DashboarNameValueCardModel
                                {
                                    Name = a.First().Category.ToString(),
                                    Value = Math.Abs(a.Sum(b => b.Amount * (1 / rate))),
                                }
                        )
                        .ToList()
                );
            }

            return Ok(
                data.GroupBy(x => x.Name)
                    .Select(
                        y =>
                            new DashboarNameValueCardModel
                            {
                                Name = y.First().Name,
                                Value = y.Sum(z => z.Value)
                            }
                    )
                    .OrderByDescending(a => a.Value)
                    .ToList()
            );
        }

        [HttpGet("ExpenseByDate")]
        public ActionResult GetExpenseByDate([FromQuery] DashboardFilterModel filter)
        {
            if (IsFilterInvalid(filter))
                return BadRequest(ModelState);

            List<Account> accounts = GetAccounts(filter);
            List<Currency> rates = _currencyRepository.GetRates(filter.BaseCurrency, accounts);
            List<DashboarNameValueCardModel> data = new List<DashboarNameValueCardModel>();

            List<string> accountCurrencies = accounts.Select(x => x.Currency).Distinct().ToList();
            foreach (string currency in accountCurrencies)
            {
                decimal rate = GetRate(rates, currency, filter.BaseCurrency);

                data.AddRange(
                    accounts
                        .Where(x => x.Currency == currency)
                        .SelectMany(y => y.Transactions)
                        .Where(
                            z =>
                                z.Date >= filter.From
                                && z.Date <= filter.To
                                && z.Type == TranType.Debit
                        )
                        .GroupBy(z => z.Date)
                        .Select(
                            a =>
                                new DashboarNameValueCardModel
                                {
                                    Name = a.First().Date.ToShortDateString(),
                                    Value = Math.Abs(a.Sum(b => b.Amount * (1 / rate))),
                                }
                        )
                        .ToList()
                );
            }

            return Ok(
                data.GroupBy(x => x.Name)
                    .Select(
                        y =>
                            new DashboarNameValueCardModel
                            {
                                Name = y.First().Name,
                                Value = y.Sum(z => z.Value)
                            }
                    )
                    .OrderByDescending(a => a.Value)
                    .ToList()
            );
        }

        private bool IsFilterInvalid(DashboardFilterModel filter)
        {
            string userId = GetUserIdFromToken();

            if (!_currencyRepository.CurrencyExists(filter.BaseCurrency))
                ModelState.AddModelError("message", "Currency does not exist");
            if (
                filter.PortfolioId.HasValue
                && !_portfolioRepository.PortfolioExists(userId, filter.PortfolioId.Value)
            )
                ModelState.AddModelError("message", "Portfolio does not exist");

            return !ModelState.IsValid;
        }

        private List<Account> GetAccounts(DashboardFilterModel filter)
        {
            string userId = GetUserIdFromToken();

            List<Account> accounts = _accountRepository.GetAccounts(userId);
            if (filter.PortfolioId.HasValue)
                accounts = accounts.Where(x => x.PortfolioId == filter.PortfolioId.Value).ToList();

            return accounts;
        }

        private decimal GetRate(List<Currency> rates, string accountCurrency, string filterCurrency)
        {
            if (accountCurrency == filterCurrency)
                return 1;
            else
                return rates.Where(x => x.To == accountCurrency).First().Value;
        }
    }
}
