namespace api.Models
{
    public class TransactionModel
    {
        public Guid Id { get; set; }
        public string TranDate { get; set; }
        public string Description { get; set; }
        public string CardNo { get; set; }
        public string Reference { get; set; }
        public decimal Amount { get; set; }
        public int Category { get; set; }
    }
}
