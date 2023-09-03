namespace api.Entities
{
    public class Account
    {
        public Guid Id { get; set; }
        public string PortfolioId { get; set; }
        public Portfolio Portfolio { get; set; }
        public string AccountNumber { get; set; }
        public string Name { get; set; }
        public string BankName { get; set; }
        public string StatementCode { get; set; }
    }
}
