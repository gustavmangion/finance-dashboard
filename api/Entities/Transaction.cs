namespace api.Entities
{
    public class Transaction
    {
        public Guid Id { get; set; }
        public Guid AccountId { get; set; }
        public virtual Account Account { get; set; }
        public Guid StatementId { get; set; }
        public virtual Statement Statement { get; set; }
        public DateOnly Date { get; set; }
        public DateOnly EnteredBank { get; set; }
        public string Description { get; set; } = string.Empty;
        public string CardNo { get; set; } = string.Empty;
        public string Reference { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public TranType Type { get; set; } = 0;
        public TranCategory Category { get; set; }
    }

    public enum TranType
    {
        Debit = 0,
        Credit = 1
    }

    public enum TranCategory
    {
        Purchase = 0,
        ChequeDeposit = 1,
        ChequeWithdrawal = 2,
        BankTransfer = 3,
        ATMWithdrawal = 4,
        Salary = 5,
        Refund = 6,
        Other = 99,
        BalanceBroughtForward = -1
    }
}
