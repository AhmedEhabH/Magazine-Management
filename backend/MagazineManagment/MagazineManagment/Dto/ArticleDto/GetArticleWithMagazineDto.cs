namespace MagazineManagment.Dto.ArticleDto
{
    public class GetArticleWithMagazineDto : GetArticleDto
    {
        public string MagazineName { get; set; } = string.Empty;
    }
}
