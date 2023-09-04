using api.Entities;
using api.Helpers;
using api.Models;
using api.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class AccountController : BaseController
    {
        private IAccountRepository _accountRepository;
        private readonly IPortfolioRepository _portfolioRespository;

        public AccountController(
            IAccountRepository accountRepository,
            IPortfolioRepository portfolioRepository
        )
        {
            _accountRepository =
                accountRepository ?? throw new ArgumentNullException(nameof(accountRepository));
            _portfolioRespository =
                portfolioRepository ?? throw new ArgumentNullException(nameof(portfolioRepository));
        }

        [HttpPost]
        public ActionResult CreateAccounts(AccountsModelForCreation model)
        {
            string userId = GetUserIdFromToken();

            if (model.UploadId == new Guid())
                ModelState.AddModelError("message", "Upload Id is required");
            else if (!_accountRepository.PendingStatementExists(userId, model.UploadId))
                ModelState.AddModelError("message", "Upload does not exists");
            if (model.Accounts.Count == 0)
                ModelState.AddModelError("messsage", "No accounts to setup");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            foreach (AccountModelForCreation account in model.Accounts)
            {
                if (account.PortfolioId == new Guid())
                    ModelState.AddModelError("message", "Portfolio Id is required");
                else if (!_portfolioRespository.PortfolioExists(userId, account.PortfolioId))
                    ModelState.AddModelError("message", "Portfolio does not exists");
                if (string.IsNullOrEmpty(account.Name))
                    ModelState.AddModelError("message", "Account name is required");

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                Account newAccount = new Account();
                newAccount.Name = account.Name;
                newAccount.AccountNumber = account.AccountNumber;
                newAccount.PortfolioId = account.PortfolioId;
                _accountRepository.AddAccount(newAccount);
            }

            _accountRepository.SaveChanges();

            return NoContent();
        }
    }
}
