using System.ComponentModel.DataAnnotations;

namespace api.Entities
{
    public class Account
    {
        public Guid Id { get; set; }
        public Guid PortfolioId { get; set; }
        public virtual Portfolio Portfolio { get; set; }

        [MaxLength(17)]
        public string? AccountNumber { get; set; }

        [MaxLength(45)]
        public string Name { get; set; }

        [MaxLength(45)]
        public string? BankId { get; set; }
        public virtual Bank Bank { get; set; }
        public string? IBAN { get; set; }
        public string? Currency { get; set; }

        public virtual List<Transaction> Transactions { get; set; }
        public virtual List<StatementAccount> AccountStatements { get; set; }
    }
}
