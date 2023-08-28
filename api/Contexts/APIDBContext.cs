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
        public DbSet<Bucket> Buckets { get; set; }
        public DbSet<UserBucket> UserBuckets { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserBucket>().HasKey(x => new { x.UserId, x.BucketId });
        }
    }
}
