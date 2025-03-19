using System.ComponentModel.DataAnnotations;

namespace AnalyzerServer.Models
{
    public class ReviewKeyword
    {
        public int Id { get; set; }

        [Required]
        public int ReviewId { get; set; }

        [Required]
        public int KeywordId { get; set; }

        public int Occurrences { get; set; } = 1;
    }
}