using api.Entities;
using System.Text.RegularExpressions;

namespace api.Helpers
{
    public static class TransactionHelper
    {
        public static void getSecondPart(string p2, Transaction transaction)
        {
            string pattern = "([0-9]{2}/[0-9]{2}/[0-9]{4})|([0-9,]*\\.[0-9]{2})";
            Regex regex = new Regex(pattern);

            List<string> matches = regex.Split(p2).Where(x => !string.IsNullOrEmpty(x)).ToList();

            transaction.Date = DateOnly.Parse(matches[0]);
            transaction.Amount = decimal.Parse(matches[1]) * (transaction.Type == TranType.Debit? -1 : 1);
        }

        public static void getChequeDebit(string p1, Transaction transaction)
        {
            transaction.EnteredBank = getEnteredBank(p1);
            transaction.Description = "Cheque Withdrawl";
            transaction.Reference = p1.Substring(p1.Length - 6, 6);
            transaction.Category = TranCategory.ChequeWithdrawal;
        }

        public static void getATMWithdrawal(string p1, Transaction transaction)
        {
            transaction.EnteredBank = getEnteredBank(p1);
            transaction.Description = p1.Substring(29, p1.Length - 57);
            transaction.Reference = p1.Substring(p1.Length - 8, 8);
            transaction.Category = TranCategory.ATMWithdrawal;
        }

        public static void getBankTransferCredit(string p1, Transaction transaction)
        {
            int index = p1.IndexOf("B/O");

            transaction.EnteredBank = getEnteredBank(p1);
            transaction.Description = p1.Substring(index + 4, p1.Length - (index + 12));
            transaction.Reference = p1.Substring(p1.Length - 8, 8);
            transaction.Type = TranType.Credit;
            transaction.Category = TranCategory.BankTransfer;
        }

        public static void getRefund(string p1, Transaction transaction)
        {
            transaction.EnteredBank = getEnteredBank(p1);
            transaction.Description = p1.Substring(20, p1.Length - 31);
            transaction.CardNo = p1.Substring(p1.Length - 4, 4);
            transaction.Type = TranType.Credit;
            transaction.Category = TranCategory.Refund;
        }

        public static void getSalary(string p1, Transaction transaction)
        {
            transaction.EnteredBank = getEnteredBank(p1);
            transaction.Description = "Salary";
            transaction.Type = TranType.Credit;
            transaction.Category = TranCategory.Salary;
        }

        public static void getMiscellaneousCharge(string p1, Transaction transaction)
        {
            transaction.EnteredBank = getEnteredBank(p1);
            transaction.Description = p1.Substring(10, p1.Length - 18);
            transaction.Reference = p1.Substring(p1.Length - 8, 8);
            transaction.Category = TranCategory.Other;
        }

        public static void getPurchase(string p1, Transaction transaction)
        {
            transaction.EnteredBank = getEnteredBank(p1);
            transaction.Description = p1.Substring(20, p1.Length - 31);
            transaction.CardNo = p1.Substring(p1.Length - 10, 4);
            transaction.Reference = p1.Substring(p1.Length - 6, 6);
            transaction.Category = TranCategory.Purchase;
        }

        public static Transaction GetBalanceBroughtForward(string p1)
        {
            int index = p1.IndexOf("B/F...");
            return new Transaction()
            {
                Category = TranCategory.BalanceBroughtForward,
                Amount = decimal.Parse(p1.Substring(index + 18, p1.Length - 17))
            };
        }

        private static DateOnly getEnteredBank(string p1)
        {
            return DateOnly.Parse(p1.Substring(0, 10));
        }
    }
}
