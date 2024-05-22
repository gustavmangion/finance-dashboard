using api.Entities;
using Syncfusion.PdfToImageConverter;
using System.Globalization;
using System.Text.RegularExpressions;
using UglyToad.PdfPig;
using UglyToad.PdfPig.Content;

namespace api.Helpers
{
    public class StatementHelper
    {
        private static TextInfo textInfo = CultureInfo.CurrentCulture.TextInfo;

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

        public static string OpenStatementFile(Stream fileStream, List<string> passwords)
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
                    return CleanNextPageEntities(content);
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

        private static string CleanNextPageEntities(string text)
        {
            string pattern =
                "(Page [0-9] of [0-9]Transactions Details for the period from "
                + "[0-9]{2}/[0-9]{2}/[0-9]{4} to [0-9]{2}/[0-9]{2}/[0-9]{4}DateDescriptionChq"
                + "/Ref No.Value DateDebitCreditBalance)";

            return Regex.Replace(text, pattern, "");
        }

        public static (DateOnly, DateOnly) GetStatementDates(string content)
        {
            string pattern =
                "Transactions Details for the period from "
                + "([0-9]{2}/[0-9]{2}/[0-9]{4}) to ([0-9]{2}/[0-9]{2}/[0-9]{4})";
            Regex regex = new Regex(pattern);
            MatchCollection matches = regex.Matches(content);

            if (matches.Count == 0 || matches[0].Groups.Count != 3)
                throw new Exception("Unable to find statement date range");

            try
            {
                return (
                    DateOnly.Parse(matches[0].Groups[1].Value, new CultureInfo("en-GB")),
                    DateOnly.Parse(matches[0].Groups[2].Value, new CultureInfo("en-GB"))
                );
            }
            catch (FormatException)
            {
                return (
                    DateOnly.Parse(matches[0].Groups[1].Value, new CultureInfo("en-US")),
                    DateOnly.Parse(matches[0].Groups[2].Value, new CultureInfo("en-US"))
                );
            }
        }

        public static List<Account> GetAccountsWithTransactions(string content)
        {
            List<Account> accounts = new List<Account>();

            string[] accountsContent = content.Split("Account Details: ");
            for (int i = 1; i < accountsContent.Length; i++)
            {
                Account account = GetAccount(accountsContent[i]);
                account.Transactions = GetTransactions(accountsContent[i]);

                accounts.Add(account);
            }

            return accounts;
        }

        private static Account GetAccount(string content)
        {
            Account account = new Account();
            account.AccountNumber = content.Substring(0, 14);
            account.IBAN = content.Substring(content.IndexOf("IBAN: ") + 6, 23);
            account.Currency = content.Substring(content.IndexOf("Currency: ") + 10, 3);

            return account;
        }

        private static List<Transaction> GetTransactions(string content)
        {
            List<Transaction> transactions = new List<Transaction>();

            Regex regex = new Regex(
                "([0-9]{2}\\/[0-9]{2}\\/[0-9]{4}.*?)"
                    + "(?=[0-9]{2}\\/[0-9]{2}\\/[0-9]{4})|([0-9]{2}\\/[0-9]{2}\\/[0-9]{4}.*)Total"
            );
            List<string> transactionsContent = regex
                .Split(content)
                .Where(x => !string.IsNullOrEmpty(x))
                .ToList();
            transactions.Add(TransactionHelper.GetBalanceBroughtForward(transactionsContent[1]));
            for (int i = 2; i < transactionsContent.Count - 1; i += 2)
            {
                transactions.Add(
                    GetTransaction(transactionsContent[i], transactionsContent[i + 1])
                );
            }

            return transactions;
        }

        private static Transaction GetTransaction(string p1, string p2)
        {
            Transaction transaction = new Transaction();
            if (p1.Substring(10, 3) == "PUR")
                TransactionHelper.getPurchase(p1, transaction);
            else if (p1.Contains("I/W CLEARING CHEQUE"))
                TransactionHelper.getChequeDebit(p1, transaction);
            else if (p1.Contains("ATM WDL"))
                TransactionHelper.getATMWithdrawal(p1, transaction);
            else if (p1.Contains("B/O"))
                TransactionHelper.getBankTransferCredit(p1, transaction);
            else if (p1.Substring(10, 3) == "REF")
                TransactionHelper.getRefund(p1, transaction);
            else if (p1.Substring(10, 6) == "SALARY")
                TransactionHelper.getSalary(p1, transaction);
            else
                TransactionHelper.getMiscellaneousCharge(p1, transaction);

            TransactionHelper.getSecondPart(p2, transaction);

            transaction.Description = textInfo.ToTitleCase(transaction.Description.ToLower());
            return transaction;
        }
    }
}
