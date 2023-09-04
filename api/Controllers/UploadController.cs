using api.Entities;
using api.Helpers;
using api.Models;
using api.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security;
using UglyToad.PdfPig;
using UglyToad.PdfPig.Content;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class UploadController : BaseController
    {
        private readonly ILogger<UploadController> _logger;
        private readonly IAccountRepository _accountRepository;

        public UploadController(
            ILogger<UploadController> logger,
            IAccountRepository accountRepository
        )
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _accountRepository =
                accountRepository ?? throw new ArgumentNullException(nameof(accountRepository));
        }

        [HttpPost("UploadStatement")]
        public ActionResult UploadStatement([FromForm] IFormFile file)
        {
            if (file == null || file.Length < 0)
                ModelState.AddModelError("message", "File is missing or corrupt");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            string userId = GetUserIdFromToken();

            List<Account> accounts = _accountRepository.GetAccounts(userId).ToList();

            string content = StatementHelper.OpenStatementFile(
                file,
                accounts.Select(x => x.StatementCode).ToList()
            );

            if (string.IsNullOrEmpty(content))
                return Ok(HandleNeedStatementPassword(file));

            List<string> accountsToBeSetup = GetNotSetupAccounts(content);
            if (accountsToBeSetup.Count > 0)
                return Ok(HandleNewAccount(file, userId));

            List<Account> accountTransactions = StatementHelper.GetAccountsAndTransactions(content);
            foreach (Account account in accountTransactions)
            {
                Guid accountId = accounts
                    .Where(x => x.AccountNumber == account.AccountNumber)
                    .First()
                    .Id;
                HandleAddTransactions(account.Transactions, accountId);
            }

            _accountRepository.SaveChanges();

            return NoContent();
        }

        private Account HandleSaveAccount(List<Account> accounts)
        {
            throw new NotImplementedException();
        }

        private void HandleAddTransactions(List<Transaction> transactions, Guid accountId)
        {
            transactions.ForEach(x => x.AccountId = accountId);
            _accountRepository.AddTransactions(transactions);
        }

        private object? HandleNeedStatementPassword(IFormFile file)
        {
            throw new NotImplementedException();
        }

        private List<string> GetNotSetupAccounts(string content)
        {
            throw new NotImplementedException();
        }

        private StatementUploadResultModel HandleNewAccount(IFormFile file, string userId)
        {
            Statement statement = new Statement() { UserId = userId, };
            _accountRepository.AddStatement(statement);
            _accountRepository.SaveChanges();
            string path = Path.Combine(
                Directory.GetCurrentDirectory(),
                "WorkingDirectory",
                "StatementUploads",
                $"{statement.Id}.pdf"
            );
            using (Stream fileStream = new FileStream(path, FileMode.Create))
                file.CopyTo(fileStream);

            return new StatementUploadResultModel()
            {
                uploadId = statement.Id,
                needPassword = true
            };
        }
    }
}
