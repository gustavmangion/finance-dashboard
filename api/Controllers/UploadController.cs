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
                file.OpenReadStream(),
                accounts.Select(x => x.StatementCode).ToList()
            );

            if (string.IsNullOrEmpty(content))
                return Ok(HandleNeedStatementPassword(file, userId));

            List<string> accountsToBeSetup = GetNotSetupAccounts(
                content,
                accounts.Select(x => x.AccountNumber).ToList()
            );
            if (accountsToBeSetup.Count > 0)
                return Ok(HandleNewAccount(file, userId, accountsToBeSetup));

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

        private List<string> GetNotSetupAccounts(string content, List<string> accountNumbers)
        {
            List<string> notSetup = new List<string>();

            string[] contentSplit = content.Split("Account Details: ");
            foreach (string s in contentSplit)
            {
                string accNo = s.Substring(0, 14);
                if (!accountNumbers.Contains(accNo))
                    notSetup.Add(accNo);
            }

            return notSetup;
        }

        private object? HandleNeedStatementPassword(IFormFile file, string userId)
        {
            Guid statementId = SaveStatementAndFile(file, userId);

            return new StatementUploadResultModel()
            {
                uploadId = statementId,
                needPassword = true,
            };
        }

        private StatementUploadResultModel HandleNewAccount(
            IFormFile file,
            string userId,
            List<string> accountsToSetup
        )
        {
            Guid statementId = SaveStatementAndFile(file, userId);

            return new StatementUploadResultModel()
            {
                uploadId = statementId,
                needPassword = false,
                accountsToSetup = accountsToSetup
            };
        }

        private Guid SaveStatementAndFile(IFormFile file, string userId)
        {
            Statement statement = new Statement() { UserId = userId, };
            _accountRepository.AddStatement(statement);
            _accountRepository.SaveChanges();

            using (
                Stream fileStream = new FileStream(
                    AppSettingHelper.getStatementFileDirectory(statement.Id),
                    FileMode.Create
                )
            )
                file.CopyTo(fileStream);

            return statement.Id;
        }
    }
}
