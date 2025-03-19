using System;
using System.ComponentModel.DataAnnotations;

namespace AnalyzerServer.Models
{
    public class Session
    {
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public string SessionToken { get; set; }

        [Required]
        public DateTime ExpiresAt { get; set; }
    }
}