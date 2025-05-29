using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace MagazineManagment.Model
{
    public class Article
    {
        public Article()
        {
            // Initialize collections if you add tags, categories, etc.
        }

        public int Id { get; set; }
        public int MagazineId { get; set; }

        [Required]
        [MaxLength(255)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(255)]
        public string? Subtitle { get; set; }

        [Required]
        public string Content { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Summary { get; set; }

        public int? PageNumber { get; set; }

        [MaxLength(255)]
        public string? Source { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [MaxLength(50)]
        public string? Status { get; set; }

        // Foreign key to Identity User
        [Required]
        public string AuthorId { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? ReviewComments { get; set; }

        public DateTime? ReviewedAt { get; set; }

        public string? ReviewedBy { get; set; }

        // Navigation properties
        public virtual Magazine? Magazine { get; set; }

        // Navigation property to Identity User
        public virtual IdentityUser? AuthorUser { get; set; }
        [MaxLength(255)]
        public string? Author { get; set; }

    }
}
