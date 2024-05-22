using System.ComponentModel.DataAnnotations.Schema;

namespace api.Entities
{
    public class Statement
    {
        public Guid Id { get; set; }
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
        public string UploadedUserId { get; set; }
        public DateOnly? From { get; set; }
        public DateOnly? To { get; set; }

        public virtual List<Transaction> Transactions { get; set; } = new List<Transaction>();
        public virtual List<StatementAccount> StatementAccounts { get; set; } =
            new List<StatementAccount>();

        [NotMapped]
        public List<string> AccountsNotSetup { get; set; } = new List<string>();
    }
}
