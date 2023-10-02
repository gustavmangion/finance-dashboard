using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Entities
{
    public class Portfolio
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        [MaxLength(40)]
        public string Name { get; set; }
        public string OwnerId { get; set; }

        [ForeignKey("OwnerId")]
        public virtual User User { get; set; }

        public virtual List<UserPortfolio> UserPortfolios { get; set; } = new List<UserPortfolio>();
        public virtual List<Account> Accounts { get; set; } = new List<Account>();
    }
}
