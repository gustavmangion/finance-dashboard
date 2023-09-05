﻿namespace api.Entities
{
    public class Statement
    {
        public Guid Id { get; set; }
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
        public string UserId { get; set; }
        public DateOnly? From { get; set; }
        public DateOnly? To { get; set; }

        public virtual List<Transaction> Transactions { get; set; }
        public virtual List<StatementAccount> StatementAccounts { get; set; }
    }
}
