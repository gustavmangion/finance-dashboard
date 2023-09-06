using api.Entities;
using System.Security;
using System.Security.Cryptography;
using System.Security.Principal;
using System.Text;
using System.Text.RegularExpressions;
using UglyToad.PdfPig;
using UglyToad.PdfPig.Content;

namespace api.Helpers
{
    public class StatementHelper
    {
        private static byte[] salt = Encoding.Unicode.GetBytes("WT7yGYvbg6");

        public static string EncryptPasscode(string passcode)
        {
            if (string.IsNullOrEmpty(passcode))
                return passcode;

            string encryptedCode = string.Empty;
            byte[] codeBytes = Encoding.Unicode.GetBytes(passcode);
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes rfc = new Rfc2898DeriveBytes(
                    AppSettingHelper.StatementCodeKey,
                    salt,
                    1000,
                    HashAlgorithmName.SHA256
                );
                encryptor.Key = rfc.GetBytes(32);
                encryptor.IV = rfc.GetBytes(16);

                using (MemoryStream stream = new MemoryStream())
                {
                    using (
                        CryptoStream cryptoStream = new CryptoStream(
                            stream,
                            encryptor.CreateEncryptor(),
                            CryptoStreamMode.Write
                        )
                    )
                    {
                        cryptoStream.Write(codeBytes, 0, codeBytes.Length);
                        cryptoStream.Close();
                    }
                    encryptedCode = Convert.ToBase64String(stream.ToArray());
                }
            }

            return encryptedCode;
        }

        private static string DecryptPasscode(string encryptedCode)
        {
            if (string.IsNullOrEmpty(encryptedCode))
                return string.Empty;

            SecureString decryptedCode = new SecureString();
            byte[] codeBytes = Convert.FromBase64String(encryptedCode);
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes rfc = new Rfc2898DeriveBytes(
                    AppSettingHelper.StatementCodeKey,
                    salt,
                    1000,
                    HashAlgorithmName.SHA256
                );
                encryptor.Key = rfc.GetBytes(32);
                encryptor.IV = rfc.GetBytes(16);

                using (MemoryStream stream = new MemoryStream())
                {
                    using (
                        CryptoStream cryptoStream = new CryptoStream(
                            stream,
                            encryptor.CreateDecryptor(),
                            CryptoStreamMode.Write
                        )
                    )
                    {
                        cryptoStream.Write(codeBytes, 0, codeBytes.Length);
                        cryptoStream.Close();
                    }

                    return Encoding.Unicode.GetString(stream.ToArray());
                }
            }
        }

        public static string OpenStatementFile(Stream fileStream, List<string> passwords)
        {
            List<string> decryptedPasswords = new List<string>();

            foreach (string passsword in passwords)
                decryptedPasswords.Add(DecryptPasscode(passsword));

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

                    for (int i = 1; i < pageCount; i++)
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

            return (
                DateOnly.Parse(matches[0].Groups[1].Value),
                DateOnly.Parse(matches[0].Groups[2].Value)
            );
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
            return transaction;
        }
    }
}
