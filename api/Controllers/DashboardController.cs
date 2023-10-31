using api.Entities;
using api.Models;
using api.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DashboardController : BaseController
    {
        private readonly IUserRepository _userRepository;
        private readonly IAccountRepository _accountRepository;
        private readonly ICurrencyRepository _currencyRepository;

        public DashboardController(
            IUserRepository userRepository,
            IAccountRepository accountRepository,
            ICurrencyRepository currencyRepository
        )
        {
            _userRepository =
                userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _accountRepository =
                accountRepository ?? throw new ArgumentNullException(nameof(accountRepository));
            _currencyRepository =
                currencyRepository ?? throw new ArgumentNullException(nameof(currencyRepository));
        }

        [HttpGet("OverviewTotal/{currency}")]
        public ActionResult GetOverviewTotal(string currency)
        {
            currency = currency.ToUpper();

            if (!_currencyRepository.CurrencyExists(currency))
                ModelState.AddModelError("message", "Currency does not exist");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            string userId = GetUserIdFromToken();

            List<Account> accounts = _accountRepository.GetAccounts(userId);
            List<Currency> rates = _currencyRepository.GetRates(
                currency,
                accounts.Select(x => x.Currency).ToList()
            );
            DateOnly latestStatementDate = _accountRepository.GetLatestStatement(userId).From.Value;
            Statement? previousStatement = _accountRepository.GetPreviousStatement(
                latestStatementDate
            );

            DashboardNumberCardModel model = new DashboardNumberCardModel();

            foreach (Account account in accounts)
            {
                decimal rate;

                if (account.Currency == currency)
                    rate = 1;
                else
                    rate = rates.Where(x => x.To == account.Currency).First().Value;

                decimal total = account.Transactions.Sum(x => x.Amount);
                model.Current += total * (1 / rate);

                if (previousStatement != null)
                {
                    total = account.Transactions
                        .Where(x => x.Date < previousStatement.To)
                        .Sum(x => x.Amount);
                    model.Previous += total * (1 / rate);
                }
            }

            return Ok(model);
        }
    }
}
