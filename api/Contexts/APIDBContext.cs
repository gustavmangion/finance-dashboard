using api.Entities;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics.CodeAnalysis;

namespace api.Contexts
{
    public class APIDBContext : DbContext
    {
        public APIDBContext([NotNull] DbContextOptions options)
            : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Portfolio> Portfolios { get; set; }
        public DbSet<UserPortfolio> UserPortfolios { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Statement> Statements { get; set; }
        public DbSet<Transaction> Transactions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserPortfolio>().HasKey(x => new { x.UserId, x.PortfolioId });
        }
    }
}
