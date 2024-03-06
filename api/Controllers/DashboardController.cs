using api.Entities;
using api.Models;
using api.Repositories;
using Microsoft.AspNetCore.Mvc;
using api.Helpers;
using AutoMapper;
using NLog.Filters;

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
        private readonly ITransactionRepository _transactionRepository;
        private readonly IMapper _mapper;

        public DashboardController(
            IUserRepository userRepository,
            IAccountRepository accountRepository,
            ICurrencyRepository currencyRepository,
            IPortfolioRepository portfolioRepository,
            ITransactionRepository transactionRepository,
            IMapper mapper
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
            _transactionRepository =
                transactionRepository
                ?? throw new ArgumentNullException(nameof(transactionRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
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
        public ActionResult GetHighestSpend([FromQuery] DashboardFilterModel filter)
        {
            if (IsFilterInvalid(filter))
                return BadRequest(ModelState);

            TranCategory category = new TranCategory();
            bool filterByCategory = Enum.TryParse(filter.FilterById, out category);

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
                                && (!filterByCategory || z.Category == category)
                        )
                        .GroupBy(z => z.Description)
                        .Select(
                            a =>
                                new DashboarNameValueCardModel
                                {
                                    Name = a.First().Description,
                                    Value = Math.Abs(a.Sum(b => b.Amount * (1 / rate))),
                                    Count = a.Count()
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
                                Value = y.Sum(z => z.Value),
                                Count = y.Sum(z => z.Count)
                            }
                    )
                    .OrderByDescending(a => a.Value)
                    .Take(AppSettingHelper.DrillDownMaxRecords)
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

            int dayDiff = filter.To.DayNumber - filter.From.DayNumber;

            data = data.GroupBy(x => x.Name)
                .Select(
                    y =>
                        new DashboarNameValueCardModel
                        {
                            Name = y.First().Name,
                            Value = y.Sum(z => z.Value)
                        }
                )
                .OrderByDescending(a => a.Value)
                .ToList();

            List<DashboarNameValueCardModel> toReturn = new List<DashboarNameValueCardModel>();
            for (int i = 0; i < dayDiff; i++)
            {
                string currDate = filter.From.AddDays(i).ToShortDateString();
                DashboarNameValueCardModel? dataPointToday = data.Where(x => x.Name == currDate)
                    .FirstOrDefault();

                if (dataPointToday != null)
                    toReturn.Add(dataPointToday);
                else
                    toReturn.Add(new DashboarNameValueCardModel { Name = currDate });
            }

            return Ok(toReturn);
        }

        [HttpGet("CardTransactions")]
        public ActionResult GetCardTransactions([FromQuery] DashboardFilterModel filter)
        {
            if (!_currencyRepository.CurrencyExists(filter.BaseCurrency))
                ModelState.AddModelError("message", "Currency does not exist");
            if (filter.FilterById == null)
                ModelState.AddModelError("message", "Card number is required");
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            List<Transaction> toReturn = _transactionRepository
                .GetCardTransactions(filter.FilterById, filter.From, filter.To)
                .OrderBy(x => x.Amount)
                .Take(AppSettingHelper.DrillDownMaxRecords)
                .ToList();

            toReturn = GetTransactionsConverted(toReturn, filter.BaseCurrency);

            return Ok(_mapper.Map<List<TransactionModel>>(toReturn));
        }

        [HttpGet("VendorTransactions")]
        public ActionResult GetTransactionsByVendor([FromQuery] DashboardFilterModel filter)
        {
            if (!_currencyRepository.CurrencyExists(filter.BaseCurrency))
                ModelState.AddModelError("message", "Currency does not exist");
            if (filter.FilterById == null)
                ModelState.AddModelError("message", "Vendor name is required");
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            List<Account> accounts = GetAccounts(filter);
            List<Currency> rates = _currencyRepository.GetRates(filter.BaseCurrency, accounts);
            List<Transaction> transactions = new List<Transaction>();

            List<string> accountCurrencies = accounts.Select(x => x.Currency).Distinct().ToList();
            foreach (string currency in accountCurrencies)
            {
                decimal rate = GetRate(rates, currency, filter.BaseCurrency);

                List<Transaction> currencyTrans = accounts
                    .Where(x => x.Currency == currency)
                    .SelectMany(y => y.Transactions)
                    .Where(
                        z =>
                            z.Date >= filter.From
                            && z.Date <= filter.To
                            && z.Type == TranType.Debit
                            && z.Description.Equals(filter.FilterById)
                    )
                    .ToList();
                foreach (Transaction trans in currencyTrans)
                    trans.Amount = trans.Amount * (1 / rate);

                transactions.AddRange(currencyTrans);
            }

            return Ok(_mapper.Map<List<TransactionModel>>(transactions.OrderBy(x => x.Amount)));
        }

        [HttpGet("Transactions")]
        public ActionResult GetTransactions([FromQuery] DashboardFilterModel filter)
        {
            if (!_currencyRepository.CurrencyExists(filter.BaseCurrency))
                ModelState.AddModelError("message", "Currency does not exist");
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            List<Account> accounts = GetAccounts(filter);
            List<Currency> rates = _currencyRepository.GetRates(filter.BaseCurrency, accounts);
            List<Transaction> transactions = new List<Transaction>();

            List<string> accountCurrencies = accounts.Select(x => x.Currency).Distinct().ToList();
            foreach (string currency in accountCurrencies)
            {
                decimal rate = GetRate(rates, currency, filter.BaseCurrency);

                List<Transaction> currencyTrans = accounts
                    .Where(x => x.Currency == currency)
                    .SelectMany(y => y.Transactions)
                    .Where(
                        z =>
                            z.Date >= filter.From && z.Date <= filter.To && z.Type == TranType.Debit
                    )
                    .ToList();
                foreach (Transaction trans in currencyTrans)
                    trans.Amount = trans.Amount * (1 / rate);

                transactions.AddRange(currencyTrans);
            }

            return Ok(_mapper.Map<List<TransactionModel>>(transactions.OrderBy(x => x.Amount)));
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

        private List<Transaction> GetTransactionsConverted(
            List<Transaction> transactions,
            string toCurrency
        )
        {
            if (transactions.Count > 0)
            {
                if (!transactions[0].Account.Currency.Equals(toCurrency))
                {
                    Currency rate = _currencyRepository.GetRate(
                        toCurrency,
                        transactions[0].Account.Currency
                    );
                    foreach (Transaction t in transactions)
                        t.Amount = t.Amount * (1 / rate.Value);
                }
            }
            return transactions;
        }
    }
}
