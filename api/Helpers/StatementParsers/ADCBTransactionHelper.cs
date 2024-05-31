using api.Entities;
using System.Globalization;
using System.Text.RegularExpressions;

namespace api.Helpers.StatementHelpers
{
    public static class ADCBTransactionHelper
    {
        private static readonly Regex _secondPartRegex = new Regex(
            "([0-9]{2}/[0-9]{2}/[0-9]{4})|([0-9,]*\\.[0-9]{2})"
        );
        private static readonly Regex _extraSpaceRegex = new Regex("[ ]{2,}");

        public static void getSecondPart(string p2, Transaction transaction)
        {
            List<string> matches = _secondPartRegex
                .Split(p2)
                .Where(x => !string.IsNullOrEmpty(x))
                .ToList();

            try
            {
                transaction.Date = DateOnly.Parse(matches[0], new CultureInfo("en-GB"));
            }
            catch (FormatException)
            {
                transaction.Date = DateOnly.Parse(matches[0], new CultureInfo("en-US"));
            }

            transaction.Amount =
                decimal.Parse(matches[1]) * (transaction.Type == TranType.Debit ? -1 : 1);
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
            transaction.Description = RemoveExtraSpaces(p1.Substring(24, p1.Length - 42));
            transaction.Reference = p1.Substring(p1.Length - 8, 8);
            transaction.Category = TranCategory.ATMWithdrawal;
        }

        public static void getBankTransferCredit(string p1, Transaction transaction)
        {
            int index = p1.IndexOf("B/O");

            transaction.EnteredBank = getEnteredBank(p1);
            transaction.Description = RemoveExtraSpaces(
                p1.Substring(index + 4, p1.Length - (index + 12))
            );
            transaction.Reference = p1.Substring(p1.Length - 8, 8);
            transaction.Type = TranType.Credit;
            transaction.Category = TranCategory.BankTransfer;
        }

        public static void getRefund(string p1, Transaction transaction)
        {
            transaction.EnteredBank = getEnteredBank(p1);
            transaction.Description = RemoveExtraSpaces(p1.Substring(20, p1.Length - 31));
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
            transaction.Description = RemoveExtraSpaces(p1.Substring(10, p1.Length - 18));
            transaction.Reference = p1.Substring(p1.Length - 8, 8);
            transaction.Category = TranCategory.Other;
        }

        public static void getPurchase(string p1, Transaction transaction)
        {
            transaction.EnteredBank = getEnteredBank(p1);

            int cardRefStart = p1.Trim().LastIndexOf(" ") + 1;
            string lastPiece = p1.Substring(cardRefStart);
            while (!char.IsNumber(lastPiece[0]))
            {
                cardRefStart++;
                lastPiece = p1.Substring(cardRefStart);
            }

            transaction.Description = RemoveExtraSpaces(p1.Substring(20, cardRefStart - 20));
            transaction.CardNo = lastPiece.Substring(0, 4);
            transaction.Reference = lastPiece.Substring(4);
            transaction.Category = TranCategory.Purchase;
        }

        public static Transaction GetBalanceBroughtForward(string p1)
        {
            int index = p1.IndexOf("B/F...");
            return new Transaction()
            {
                Category = TranCategory.BalanceBroughtForward,
                Type = TranType.Adjustment,
                Amount = decimal.Parse(p1.Substring(index + 18, p1.Length - 17))
            };
        }

        private static DateOnly getEnteredBank(string p1)
        {
            try
            {
                return DateOnly.Parse(p1.Substring(0, 10), new CultureInfo("en-GB"));
            }
            catch (FormatException)
            {
                return DateOnly.Parse(p1.Substring(0, 10), new CultureInfo("en-US"));
            }
        }

        private static string RemoveExtraSpaces(string s)
        {
            return _extraSpaceRegex.Replace(s, " ").Trim();
        }
    }
}
