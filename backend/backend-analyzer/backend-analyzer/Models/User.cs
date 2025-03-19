using System;
using System.ComponentModel.DataAnnotations;

namespace AnalyzerServer.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Username { get; set; }

        [Required]
        [MaxLength(100)]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        [Required]
        public int RoleId { get; set; } = 2;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}