﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Entities
{
    public class Portfolio
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        public string OwnerId { get; set; }

        [ForeignKey("OwnerId")]
        public virtual User User { get; set; }

        [NotMapped]
        public bool? IsOwner { get; set; }

        public virtual List<UserPortfolio> UserPortfolios { get; set; } = new List<UserPortfolio>();
        public virtual List<Account> Accounts { get; set; } = new List<Account>();
    }
}
