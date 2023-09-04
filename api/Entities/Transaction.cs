namespace api.Entities
{
    public class Transaction
    {
        public Guid Id { get; set; }
        public Guid AccountId { get; set; }
        public Account Account { get; set; }
        public Guid StatementId { get; set; }
        public Statement Statement { get; set; }
    }
}
