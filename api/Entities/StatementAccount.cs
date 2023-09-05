namespace api.Entities
{
    public class StatementAccount
    {
        public Guid StatementId { get; set; }
        public virtual Statement Statement { get; set; }
        public Guid AccountId { get; set; }
        public virtual Account Account { get; set; }
    }
}
