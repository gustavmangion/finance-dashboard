namespace api.Entities
{
    public class StatementAccount
    {
        public Guid StatementId { get; set; }
        public Statement Statement { get; set; }
        public Guid AccountId { get; set; }
        public Account Account { get; set; }
    }
}
