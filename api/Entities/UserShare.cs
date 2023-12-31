﻿namespace api.Entities
{
    public class UserShare
    {
        public Guid Id { get; set; }
        public string UserId { get; set; }
        public string? SharedWith { get; set; }
        public string Alias { get; set; }
        public string InviteCode { get; set; }
        public DateOnly SharedOn { get; set; } = DateOnly.FromDateTime(DateTime.Now);
        public bool Revoked { get; set; }

        public virtual List<UserPortfolio> UserPortfolios { get; set; } = new List<UserPortfolio>();
    }
}
