﻿using System.ComponentModel.DataAnnotations.Schema;

namespace api.Entities
{
    public class User
    {
        public string Id { get; set; }
        public DateOnly Joined { get; set; } = DateOnly.FromDateTime(DateTime.Now);

        [NotMapped]
        public bool SetupNeeded { get; set; }

        public virtual List<UserPortfolio> UserPortfolios { get; set; } =
            new List<UserPortfolio> { };
    }
}
