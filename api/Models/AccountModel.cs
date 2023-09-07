namespace api.Models
{
    public class AccountModel
    {
        public Guid Id { get; set; }
        public Guid PortfolioId { get; set; }
        public string AccountNumber { get; set; }
        public string Name { get; set; }
        public string IBAN { get; set; }
        public string Currency { get; set; }
    }
}
