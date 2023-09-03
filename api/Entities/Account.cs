using System.ComponentModel.DataAnnotations;

namespace api.Entities
{
    public class Account
    {
        public Guid Id { get; set; }
        public string PortfolioId { get; set; }
        public Portfolio Portfolio { get; set; }

        [MaxLength(17)]
        public string AccountNumber { get; set; }

        [MaxLength(45)]
        public string Name { get; set; }

        [MaxLength(45)]
        public string BankName { get; set; }
        public string StatementCode { get; set; }
    }
}
