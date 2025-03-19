using Microsoft.EntityFrameworkCore;
using AnalyzerServer.Models;

namespace AnalyzerServer.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Keyword> Keywords { get; set; }
        public DbSet<ReviewKeyword> ReviewKeywords { get; set; }
        public DbSet<Session> Sessions { get; set; }
        public DbSet<ReviewStatistic> ReviewStatistics { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>().ToTable("users");
            modelBuilder.Entity<Review>().ToTable("reviews");
            modelBuilder.Entity<Keyword>().ToTable("keywords");
            modelBuilder.Entity<ReviewKeyword>().ToTable("review_keywords");
            modelBuilder.Entity<Session>().ToTable("sessions");
            modelBuilder.Entity<ReviewStatistic>().ToTable("review_statistics");
        }
    }
}