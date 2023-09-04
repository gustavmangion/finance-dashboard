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

        public AccountController(IAccountRepository accountRepository, IPortfolioRepository portfolioRepository)
        {
            _accountRepository = accountRepository ?? throw new ArgumentNullException(nameof(accountRepository));
            _portfolioRespository = portfolioRepository ?? throw new ArgumentNullException(nameof(portfolioRepository));
        }

        [HttpPost]
        public ActionResult CreateAccount(AccountModelForCreation model)
        {
            string userId = GetUserIdFromToken();

            if (model.PortfolioId == new Guid())
                ModelState.AddModelError("message", "Portfolio Id is required");
            else if (!_portfolioRespository.PortfolioExists(userId, model.PortfolioId))
                ModelState.AddModelError("message", "Portfolio does not exists");
            if (model.UploadId == new Guid())
                ModelState.AddModelError("message", "Upload Id is required");
            if (string.IsNullOrEmpty(model.Name))
                ModelState.AddModelError("message", "Account name is required");
            else if (!_accountRepository.PendingStatementExists(userId, model.UploadId))
                ModelState.AddModelError("message", "Upload does not exists");
            if(!ModelState.IsValid) return BadRequest(ModelState);

            string encryptedStatementCode = StatementHelper.EncryptPasscode(model.StatementCode);

            Account newAccount = new Account();
            newAccount.Name = model.Name;
            newAccount.PortfolioId = model.PortfolioId;
            newAccount.StatementCode = encryptedStatementCode;
            _accountRepository.AddAccount(newAccount);

            Statement pendingStatement = _accountRepository.GetStatement(model.UploadId);
            pendingStatement.AccountId = newAccount.Id;

            _accountRepository.SaveChanges();

            return NoContent();
        }
    }
}
