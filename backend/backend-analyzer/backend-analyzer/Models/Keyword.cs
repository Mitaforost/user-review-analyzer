using System.ComponentModel.DataAnnotations;

namespace AnalyzerServer.Models
{
    public class Keyword
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string KeywordText { get; set; }
    }
}