using System;

namespace AnalyzerServer.Models
{
    public class ReviewStatistic
    {
        public int Id { get; set; }

        public decimal AverageRating { get; set; } = 0.00m;

        public string MostPopularKeyword { get; set; }

        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
    }
}