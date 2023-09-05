using api.Entities;
using api.Helpers;
using api.Models;
using api.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IO;

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

            List<string> statementCodes = _accountRepository
                .GetStatementCodes(userId)
                .Select(x => x.Code)
                .ToList();
            string content = StatementHelper.OpenStatementFile(
                file.OpenReadStream(),
                statementCodes
            );

            if (string.IsNullOrEmpty(content))
                return Ok(HandleNeedStatementPassword(file, userId));

            List<Account> accounts = _accountRepository.GetAccounts(userId).ToList();
            List<string> accountsToBeSetup = GetNotSetupAccounts(
                content,
                accounts.Select(x => x.AccountNumber).ToList()
            );
            accountsToBeSetup.RemoveAt(0);
            if (accountsToBeSetup.Count > 0)
                return Ok(HandleNewAccount(file, userId, accountsToBeSetup));

            SaveAccountTransactions(content, accounts);

            return NoContent();
        }

        [HttpPost("StatementPassword")]
        public ActionResult SetStatementPassword(StatementNewPasswordModel model)
        {
            string userId = GetUserIdFromToken();

            if (model.UploadId == new Guid())
                ModelState.AddModelError("message", "Upload id is required");
            else if (!_accountRepository.PendingStatementExists(userId, model.UploadId))
                ModelState.AddModelError("message", "Upload id does not exist");
            if (string.IsNullOrEmpty(model.Password))
                ModelState.AddModelError("message", "Password is required");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            string path = AppSettingHelper.getStatementFileDirectory(model.UploadId);

            if (!System.IO.File.Exists(path))
            {
                ModelState.AddModelError("message", "File no longer exists");
                return BadRequest(ModelState);
            }

            string content = string.Empty;
            string code = StatementHelper.EncryptPasscode(model.Password);

            using (Stream stream = new FileStream(path, FileMode.Open))
            {
                content = StatementHelper.OpenStatementFile(stream, new List<string>() { code });
            }

            if (string.IsNullOrEmpty(content))
            {
                return Ok(new StatementUploadResultModel() { needPassword = true, });
            }

            _accountRepository.AddStatementCode(
                new StatementCode() { UserId = userId, Code = code, }
            );
            _accountRepository.SaveChanges();

            List<Account> accounts = _accountRepository.GetAccounts(userId).ToList();
            List<string> accountsToBeSetup = GetNotSetupAccounts(
                content,
                accounts.Select(x => x.AccountNumber).ToList()
            );
            accountsToBeSetup.RemoveAt(0); //Remove page part
            if (accountsToBeSetup.Count > 0)
                return Ok(HandleNewAccount(model.UploadId, userId, accountsToBeSetup));

            SaveAccountTransactions(content, accounts);

            return NoContent();
        }

        [HttpPost("ResubmitUpload")]
        public ActionResult ResubmitUpload(StatementResubmitModel model)
        {
            string userId = GetUserIdFromToken();

            if (model.UploadId == new Guid())
                ModelState.AddModelError("message", "Upload id is required");
            else if (!_accountRepository.PendingStatementExists(userId, model.UploadId))
                ModelState.AddModelError("message", "Upload id does not exist");

            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            string path = AppSettingHelper.getStatementFileDirectory(model.UploadId);

            if (!System.IO.File.Exists(path))
            {
                ModelState.AddModelError("message", "File no longer exists");
                return BadRequest(ModelState);
            }

            string content = string.Empty;
            List<Account> accounts = _accountRepository.GetAccounts(userId);
            List<string> statementCodes = _accountRepository
               .GetStatementCodes(userId)
               .Select(x => x.Code)
               .ToList();

            using (Stream stream = new FileStream(path, FileMode.Open))
            {
                content = StatementHelper.OpenStatementFile(stream, statementCodes);
            }

            if (string.IsNullOrEmpty(content))
            {
                ModelState.AddModelError("message", "Unable to process statement");
                return BadRequest(ModelState);
            }

            SaveAccountTransactions(content, accounts);

            return NoContent();
        }


        private void SaveAccountTransactions(string content, List<Account> accounts)
        {
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

            return HandleNewAccount(statementId, userId, accountsToSetup);
        }

        private StatementUploadResultModel HandleNewAccount(
            Guid fileId,
            string userId,
            List<string> accountsToSetup
        )
        {
            return new StatementUploadResultModel()
            {
                uploadId = fileId,
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
