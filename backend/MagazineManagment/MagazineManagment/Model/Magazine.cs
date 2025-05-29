using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace MagazineManagment.Model
{
    public class Magazine
    {
        public Magazine()
        {
            Articles = new HashSet<Article>();
        }

        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(50)]
        public string? IssueNumber { get; set; }

        public DateTime PublicationDate { get; set; }

        [MaxLength(500)]
        public string? CoverImageUrl { get; set; }

        [MaxLength(1000)]
        public string? Description { get; set; }

        [MaxLength(255)]
        public string? Editor { get; set; }

        [MaxLength(20)]
        public string? ISSN { get; set; }

        [MaxLength(100)]
        public string? Category { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public bool IsPublished { get; set; } = false;

        // Foreign key to Identity User
        [Required]
        public string CreatedBy { get; set; } = string.Empty;

        // Navigation properties
        public virtual ICollection<Article> Articles { get; set; }

        // Navigation property to Identity User
        public virtual IdentityUser? Creator { get; set; }
    }
}
