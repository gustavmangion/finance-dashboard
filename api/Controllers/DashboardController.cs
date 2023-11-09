using api.Entities;
using api.Models;
using api.Repositories;
using Microsoft.AspNetCore.Mvc;
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
            string userId = GetUserIdFromToken();

            if (!_currencyRepository.CurrencyExists(filter.BaseCurrency))
                ModelState.AddModelError("message", "Currency does not exist");
            if (
                !filter.PortfolioId.Equals("All")
                && !_portfolioRepository.PortfolioExists(userId, filter.PortfolioId)
            )
                ModelState.AddModelError("message", "Portfolio does not exist");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            List<Account> accounts = _accountRepository.GetAccounts(userId);
            if (!filter.PortfolioId.Equals("All"))
                accounts = accounts.Where(x => x.PortfolioId == filter.PortfolioId).ToList();

            List<Currency> rates = _currencyRepository.GetRates(
                filter.BaseCurrency,
                accounts.Select(x => x.Currency).ToList()
            );

            DashboardNumberCardModel all = new DashboardNumberCardModel();
            DashboardNumberCardModel credit = new DashboardNumberCardModel();
            DashboardNumberCardModel debit = new DashboardNumberCardModel();

            foreach (Account account in accounts)
            {
                decimal rate;

                if (account.Currency == filter.BaseCurrency)
                    rate = 1;
                else
                    rate = rates.Where(x => x.To == account.Currency).First().Value;

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
                debit.Current += GetAccountTransactionTotal(
                    account,
                    filter.From,
                    filter.To,
                    TranType.Debit,
                    rate
                );
                debit.Previous += GetAccountTransactionTotal(
                    account,
                    filter.FromPreviousPeriod,
                    filter.ToPreviousPeriod,
                    TranType.Debit,
                    rate
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
    }
}
