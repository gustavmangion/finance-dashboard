namespace api.Entities
{
    public class Transaction
    {
        public Guid Id { get; set; }
        public Guid AccountId { get; set; }
        public virtual Account Account { get; set; }
        public Guid StatementId { get; set; }
        public virtual Statement Statement { get; set; }
    }
}
