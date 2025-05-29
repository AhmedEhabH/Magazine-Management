namespace MagazineManagment.Dto.ArticleDto
{
    public class GetArticleDto : ArticleBaseDto
    {
        public int Id { get; set; }
        public int MagazineId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
