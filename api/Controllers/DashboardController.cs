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

        [HttpGet("OverviewCards/{currency}")]
        public ActionResult GetOverviewCards(string currency)
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
            Statement latestStatement = _accountRepository.GetLatestStatement(userId);
            Statement? previousStatement = _accountRepository.GetPreviousStatement(
                latestStatement.From.Value
            );

            DashboardNumberCardModel all = new DashboardNumberCardModel();
            DashboardNumberCardModel credit = new DashboardNumberCardModel();
            DashboardNumberCardModel debit = new DashboardNumberCardModel();

            foreach (Account account in accounts)
            {
                decimal rate;

                if (account.Currency == currency)
                    rate = 1;
                else
                    rate = rates.Where(x => x.To == account.Currency).First().Value;

                all.Current += account.Transactions.Sum(x => x.Amount) * (1 / rate);
                credit.Current +=
                    account.Transactions
                        .Where(
                            x => x.Type == TranType.Credit && x.StatementId == latestStatement.Id
                        )
                        .Sum(x => x.Amount) * (1 / rate);
                debit.Current += Math.Abs(
                    account.Transactions
                        .Where(x => x.Type == TranType.Debit && x.StatementId == latestStatement.Id)
                        .Sum(x => x.Amount) * (1 / rate)
                );

                if (previousStatement != null)
                {
                    all.Previous +=
                        account.Transactions
                            .Where(x => x.Date < previousStatement.To)
                            .Sum(x => x.Amount) * (1 / rate);
                    credit.Previous +=
                        account.Transactions
                            .Where(
                                x =>
                                    x.StatementId == previousStatement.Id
                                    && x.Type == TranType.Credit
                            )
                            .Sum(x => x.Amount) * (1 / rate);
                    debit.Previous += Math.Abs(
                        account.Transactions
                            .Where(
                                x =>
                                    x.StatementId == previousStatement.Id
                                    && x.Type == TranType.Debit
                            )
                            .Sum(x => x.Amount) * (1 / rate)
                    );
                }
            }

            return Ok(new List<DashboardNumberCardModel> { all, credit, debit });
        }
    }
}
