using api.Entities;
using System.Globalization;
using System.Text.RegularExpressions;

namespace api.Helpers.StatementHelpers
{
    internal class ADCBStatementParser : IStatementParser
    {
        private static TextInfo textInfo = CultureInfo.CurrentCulture.TextInfo;

        public string Init(string content)
        {
            content = CleanNextPageEntities(content);

            return content;
        }

        private static string CleanNextPageEntities(string text)
        {
            string pattern =
                "(Page [0-9] of [0-9]Transactions Details for the period from "
                + "[0-9]{2}/[0-9]{2}/[0-9]{4} to [0-9]{2}/[0-9]{2}/[0-9]{4}DateDescriptionChq"
                + "/Ref No.Value DateDebitCreditBalance)";

            return Regex.Replace(text, pattern, "");
        }

        public (DateOnly, DateOnly) GetStatementDates(string content)
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

        public List<string> GetAccountNumbers(string content)
        {
            return content.Split("Account Details: ").ToList();
        }

        public List<Account> GetAccountsWithTransactions(string content)
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

        private Account GetAccount(string content)
        {
            Account account = new Account();
            account.AccountNumber = content.Substring(0, 14);
            account.IBAN = content.Substring(content.IndexOf("IBAN: ") + 6, 23);
            account.Currency = content.Substring(content.IndexOf("Currency: ") + 10, 3);

            return account;
        }

        private List<Transaction> GetTransactions(string content)
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
            transactions.Add(
                ADCBTransactionHelper.GetBalanceBroughtForward(transactionsContent[1])
            );
            for (int i = 2; i < transactionsContent.Count - 1; i += 2)
            {
                transactions.Add(
                    GetTransaction(transactionsContent[i], transactionsContent[i + 1])
                );
            }

            return transactions;
        }

        private Transaction GetTransaction(string p1, string p2)
        {
            Transaction transaction = new Transaction();
            if (p1.Substring(10, 3) == "PUR")
                ADCBTransactionHelper.getPurchase(p1, transaction);
            else if (p1.Contains("I/W CLEARING CHEQUE"))
                ADCBTransactionHelper.getChequeDebit(p1, transaction);
            else if (p1.Contains("ATM WDL"))
                ADCBTransactionHelper.getATMWithdrawal(p1, transaction);
            else if (p1.Contains("B/O"))
                ADCBTransactionHelper.getBankTransferCredit(p1, transaction);
            else if (p1.Substring(10, 3) == "REF")
                ADCBTransactionHelper.getRefund(p1, transaction);
            else if (p1.Substring(10, 6) == "SALARY")
                ADCBTransactionHelper.getSalary(p1, transaction);
            else
                ADCBTransactionHelper.getMiscellaneousCharge(p1, transaction);

            ADCBTransactionHelper.getSecondPart(p2, transaction);

            transaction.Description = textInfo.ToTitleCase(transaction.Description.ToLower());
            return transaction;
        }
    }
}
