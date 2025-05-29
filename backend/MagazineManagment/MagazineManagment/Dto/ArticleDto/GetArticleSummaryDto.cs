namespace MagazineManagment.Dto.ArticleDto
{
    public class GetArticleSummaryDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Author { get; set; }
        public int MagazineId { get; set; }
        public string MagazineName { get; set; } = string.Empty;
        public string? Status { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
