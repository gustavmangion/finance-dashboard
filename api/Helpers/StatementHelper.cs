using api.Entities;
using api.Helpers.StatementHelpers;
using Syncfusion.PdfToImageConverter;
using System.Globalization;
using System.Text.RegularExpressions;
using UglyToad.PdfPig;
using UglyToad.PdfPig.Content;

namespace api.Helpers
{
    public class StatementHelper
    {
        public static IStatementParser GetParser(string bankId)
        {
            switch (bankId)
            {
                case "ADCB":
                    return new ADCBStatementParser();
                default:
                    throw new Exception("Invalid Bank");
            }
        }

        public static void GetStatement(
            string content,
            string bankId,
            List<Account> dbAccounts,
            Statement statement
        )
        {
            IStatementParser parser = GetParser(bankId);
            content = parser.Init(content);

            (statement.From, statement.To) = parser.GetStatementDates(content);

            statement.AccountsNotSetup = GetNotSetupAccounts(
                parser.GetAccountNumbers(content),
                dbAccounts.Select(x => x.AccountNumber).ToList()
            );

            if (statement.AccountsNotSetup.Count > 0)
                return;

            List<Account> accounts = parser.GetAccountsWithTransactions(content);
            foreach (Account stAccount in accounts)
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
        }

        public static byte[] GetFirstPageAsImage(string path, List<string> passwords)
        {
            if (!File.Exists(path))
                throw new Exception("File no longer exists");

            List<string> decryptedPasswords = new List<string>();

            foreach (string passsword in passwords)
                decryptedPasswords.Add(EncryptionHelper.DecryptString(passsword));

            using (
                FileStream inputStream = new FileStream(path, FileMode.Open, FileAccess.ReadWrite)
            )
            {
                PdfToImageConverter imageConverter = new PdfToImageConverter();
                foreach (string pwd in decryptedPasswords)
                {
                    imageConverter.Load(inputStream, pwd);
                    if (imageConverter.PageCount > 0)
                        break;
                }

                using (MemoryStream ms = new MemoryStream())
                {
                    Stream s = imageConverter.Convert(0, 1, false, false).First();
                    s.Position = 0;
                    s.CopyTo(ms);
                    return ms.ToArray();
                }
            }
        }

        public static string OpenAndGetStatementFileContent(
            Stream fileStream,
            List<string> passwords
        )
        {
            List<string> decryptedPasswords = new List<string>();

            foreach (string passsword in passwords)
                decryptedPasswords.Add(EncryptionHelper.DecryptString(passsword));

            try
            {
                using (
                    PdfDocument document = PdfDocument.Open(
                        fileStream,
                        new ParsingOptions { Passwords = decryptedPasswords }
                    )
                )
                {
                    string content = string.Empty;
                    int pageCount = document.NumberOfPages;

                    for (int i = 0; i < pageCount; i++)
                    {
                        //Page numbering is 1 indexed
                        Page page = document.GetPage(i + 1);
                        content += page.Text;
                    }
                    return content;
                }
            }
            catch (Exception e)
            {
                if (
                    e.Message.Equals(
                        "The document was encrypted and none of the provided passwords were the user or owner password."
                    )
                )
                {
                    return string.Empty;
                }
                throw;
            }
        }

        internal static List<string> GetNotSetupAccounts(
            List<string> accountNumbersInStatement,
            List<string> accountNumbers
        )
        {
            List<string> notSetup = new List<string>();

            foreach (string s in accountNumbersInStatement)
            {
                string accNo = s.Substring(0, 14);
                if (!accountNumbers.Contains(accNo))
                    notSetup.Add(accNo);
            }
            notSetup.RemoveAt(0);
            return notSetup;
        }

        internal static void UpdateAccountDetails(Account newDetails, Account currentDetails)
        {
            currentDetails.AccountNumber = newDetails.AccountNumber;
            currentDetails.IBAN = newDetails.IBAN;
            currentDetails.Currency = newDetails.Currency;
        }
    }
}
