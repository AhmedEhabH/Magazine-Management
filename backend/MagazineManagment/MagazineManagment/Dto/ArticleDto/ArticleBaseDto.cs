namespace MagazineManagment.Dto.ArticleDto
{
    public class ArticleBaseDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Subtitle { get; set; }
        //public string? Author { get; set; }
        public string AuthorId { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? Summary { get; set; }
        public int? PageNumber { get; set; }
        public string? Source { get; set; }
        public string? Status { get; set; }
        public string AuthorName { get; set; } = string.Empty;
        public string? ReviewComments { get; set; }
        public DateTime? ReviewedAt { get; set; }
        public string? ReviewedBy { get; set; }
    }
}
