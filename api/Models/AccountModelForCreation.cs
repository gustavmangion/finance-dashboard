namespace api.Models
{
    public class AccountModelForCreation
    {
        public Guid PortfolioId { get; set; }
        public string Name { get; set; }
        public string AccountNumber { get; set; }
        public Guid BankId { get; set; }
    }
}
