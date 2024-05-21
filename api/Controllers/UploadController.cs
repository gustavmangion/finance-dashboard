using api.Entities;
using api.Helpers;
using api.Models;
using api.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Linq;

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

            return DoUploadStatement(userId, content, file);
        }

        private ActionResult DoUploadStatement(
            string userId,
            string content,
            IFormFile? file = null,
            Guid? statementId = null,
            bool skipAccountValidation = false
        )
        {
            List<Account> accounts = _accountRepository.GetAccounts(userId).ToList();

            if (!skipAccountValidation)
            {
                //Check for not setup accounts
                List<string> accountsToBeSetup = GetNotSetupAccounts(
                    content,
                    accounts.Select(x => x.AccountNumber).ToList()
                );
                accountsToBeSetup.RemoveAt(0);
                if (accountsToBeSetup.Count > 0)
                {
                    if (statementId == null)
                        statementId = SaveStatementAndFile(file, userId);
                    return Ok(HandleNewAccount(statementId.Value, userId, accountsToBeSetup));
                }
            }

            //Parse statement transactions
            Statement statement = GetStatement(content, accounts, userId);
            if (
                _accountRepository.StatementAlreadyUploaded(
                    accounts[0].Id,
                    statement.From.Value,
                    statement.To.Value
                )
            )
                return Ok(new StatementUploadResultModel() { StatementAlreadyUploaded = true, });

            HandleGapsBetweenStatements(accounts, statement);
            _accountRepository.AddStatement(statement);
            _accountRepository.SaveChanges();

            return Ok(
                new StatementUploadResultModel()
                {
                    accountsToSetup = new List<string>(),
                    needPassword = false,
                    uploadId = new Guid()
                }
            );
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
            string code = EncryptionHelper.EncryptString(model.Password);

            using (Stream stream = new FileStream(path, FileMode.Open))
            {
                content = StatementHelper.OpenStatementFile(stream, new List<string>() { code });
            }

            if (string.IsNullOrEmpty(content))
                return Ok(new StatementUploadResultModel() { needPassword = true, });

            _accountRepository.AddStatementCode(
                new StatementCode() { UserId = userId, Code = code, }
            );
            _accountRepository.SaveChanges();

            return DoUploadStatement(userId, content, statementId: model.UploadId);
        }

        [HttpPost("ResubmitUpload")]
        public ActionResult ResubmitUpload(StatementResubmitModel model)
        {
            string userId = GetUserIdFromToken();

            if (model.UploadId == new Guid())
                ModelState.AddModelError("message", "Upload id is required");
            else if (!_accountRepository.PendingStatementExists(userId, model.UploadId))
                ModelState.AddModelError("message", "Upload id does not exist");

            if (!ModelState.IsValid)
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

            return DoUploadStatement(userId, content, skipAccountValidation: true);
        }

        private Statement GetStatement(
            string content,
            List<Account> dbAccounts,
            string userId,
            Guid? statementId = null
        )
        {
            Statement statement;
            if (statementId == null)
            {
                statement = new Statement();
                (statement.From, statement.To) = StatementHelper.GetStatementDates(content);
                statement.UploadedUserId = userId;
            }
            else
            {
                statement = _accountRepository.GetStatement(statementId.Value);
                (statement.From, statement.To) = StatementHelper.GetStatementDates(content);
            }

            List<Account> stAccountTransactions = StatementHelper.GetAccountsWithTransactions(
                content
            );
            foreach (Account stAccount in stAccountTransactions)
            {
                Account dbAccount = dbAccounts
                    .Where(x => x.AccountNumber == stAccount.AccountNumber)
                    .First();

                Transaction balanceBroughtForward = stAccount.Transactions
                    .Where(x => x.Category == TranCategory.BalanceBroughtForward)
                    .First();
                stAccount.Transactions.Remove(balanceBroughtForward);
                decimal balanceCarriedForward =
                    balanceBroughtForward.Amount + stAccount.Transactions.Sum(x => x.Amount);

                StatementAccount statementAccount = new StatementAccount()
                {
                    Statement = statement,
                    Account = dbAccount,
                    BalanceBroughtForward = balanceBroughtForward.Amount,
                    BalanceCarriedForward = balanceCarriedForward
                };

                statement.StatementAccounts.Add(statementAccount);

                if (string.IsNullOrEmpty(dbAccount.IBAN))
                    UpdateAccountDetails(stAccount, dbAccount);

                stAccount.Transactions.ForEach(x =>
                {
                    x.Account = dbAccount;
                    x.Statement = statement;
                });

                statement.Transactions.AddRange(stAccount.Transactions);
            }
            return statement;
        }

        private void UpdateAccountDetails(Account newDetails, Account currentDetails)
        {
            currentDetails.AccountNumber = newDetails.AccountNumber;
            currentDetails.IBAN = newDetails.IBAN;
            currentDetails.Currency = newDetails.Currency;
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
            Statement statement = new Statement() { UploadedUserId = userId, };
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

        private void DeleteStatementFile(Guid id, string path)
        {
            try
            {
                System.IO.File.Delete(path);
            }
            catch (Exception e)
            {
                _logger.LogError($"Unable to delete statement file - {id} - {e.Message}");
            }
        }

        private void HandleGapsBetweenStatements(List<Account> accounts, Statement statement)
        {
            List<string?> accountNumbers = statement.StatementAccounts
                .Select(x => x.Account)
                .Select(x => x.AccountNumber)
                .ToList();
            List<Account> accountsInStatement = accounts
                .Where(x => accountNumbers.Contains(x.AccountNumber))
                .ToList();

            Statement? previousStatement = new Statement() { From = DateOnly.MinValue };
            Statement? nextStatement = new Statement() { From = DateOnly.MaxValue };

            foreach (Account account in accountsInStatement)
            {
                Statement? statementToCheck = account.AccountStatements
                    .Select(x => x.Statement)
                    .Where(y => y.From < statement.From)
                    .OrderByDescending(y => y.From)
                    .FirstOrDefault();
                if (statementToCheck != null && statementToCheck.From > previousStatement.From)
                {
                    previousStatement = statementToCheck;
                    if (previousStatement.To == statement.From.Value.AddDays(-1))
                        break;
                }
            }

            foreach (Account account in accountsInStatement)
            {
                Statement? statementToCheck = account.AccountStatements
                    .Select(x => x.Statement)
                    .Where(y => y.From > statement.From)
                    .OrderBy(y => y.From)
                    .FirstOrDefault();
                if (statementToCheck != null && statementToCheck.From < nextStatement.From)
                {
                    nextStatement = statementToCheck;
                    if (statement.To == nextStatement.From.Value.AddDays(-1))
                        break;
                }
            }

            if (previousStatement.From == DateOnly.MinValue)
                previousStatement = null;
            if (nextStatement.To == DateOnly.MaxValue)
                nextStatement = null;

            List<Transaction> fillers = HandleGapBeforeStatement(statement, previousStatement);
            if (nextStatement != null)
                fillers.AddRange(HandleGapAfterStatement(statement, nextStatement));
            _accountRepository.AddTransactions(fillers);
        }

        private List<Transaction> HandleGapBeforeStatement(
            Statement statement,
            Statement? previousStatement
        )
        {
            List<Transaction> beforeFillers = new List<Transaction>();

            foreach (StatementAccount statementAccount in statement.StatementAccounts)
            {
                decimal amountBefore = statementAccount.BalanceBroughtForward;
                if (previousStatement != null)
                {
                    StatementAccount? pastStatementAccount = previousStatement.StatementAccounts
                        .Where(x => x.Account == statementAccount.Account)
                        .FirstOrDefault();

                    if (pastStatementAccount != null)
                        amountBefore =
                            statementAccount.BalanceBroughtForward
                            - pastStatementAccount.BalanceCarriedForward;
                }

                if (
                    !(
                        previousStatement != null
                        && previousStatement.To == statement.From.Value.AddDays(-1)
                    )
                )
                    beforeFillers.Add(
                        new Transaction()
                        {
                            Category = TranCategory.BalanceBroughtForward,
                            Type = TranType.Credit,
                            Account = statementAccount.Account,
                            Statement = statement,
                            Amount = amountBefore,
                            Date = statement.From.Value.AddDays(-1)
                        }
                    );
            }
            if (previousStatement != null)
                _accountRepository.DeleteTransactions(
                    previousStatement.Transactions
                        .Where(
                            x =>
                                x.Category == TranCategory.BalanceBroughtForward
                                && x.Date > x.Statement.To
                        )
                        .ToList()
                );
            return beforeFillers;
        }

        private List<Transaction> HandleGapAfterStatement(
            Statement statement,
            Statement nextStatement
        )
        {
            List<Transaction> afterFillers = new List<Transaction>();

            foreach (StatementAccount statementAccount in statement.StatementAccounts)
            {
                StatementAccount? futureStatementAccount = nextStatement.StatementAccounts
                    .Where(x => x.Account == statementAccount.Account)
                    .FirstOrDefault();

                if (futureStatementAccount != null)
                {
                    decimal amountAfter =
                        futureStatementAccount.BalanceBroughtForward
                        - statementAccount.BalanceCarriedForward;

                    if (nextStatement.From != statement.To.Value.AddDays(1))
                        afterFillers.Add(
                            new Transaction()
                            {
                                Category = TranCategory.BalanceBroughtForward,
                                Type = TranType.Credit,
                                Account = statementAccount.Account,
                                Statement = statement,
                                Amount = amountAfter,
                                Date = statement.To.Value.AddDays(1)
                            }
                        );
                }
            }
            _accountRepository.DeleteTransactions(
                nextStatement.Transactions
                    .Where(
                        x =>
                            x.Category == TranCategory.BalanceBroughtForward
                            && x.Date < x.Statement.From
                    )
                    .ToList()
            );
            return afterFillers;
        }
    }
}
