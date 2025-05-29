namespace MagazineManagment.Dto.ArticleDto
{
    public class GetArticlesDto
    {
        public List<GetArticleWithMagazineDto> Articles { get; set; } = new();
        public int TotalCount { get; set; }
    }
}
