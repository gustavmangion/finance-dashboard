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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserPortfolio>().HasKey(x => new { x.UserId, x.PortfolioId });
        }
    }
}
