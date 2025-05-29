namespace MagazineManagment.Dto.ArticleDto
{
    public class UpdateArticleDto : ArticleBaseDto
    {
        public int Id { get; set; }
        public int MagazineId { get; set; }

    }
}
