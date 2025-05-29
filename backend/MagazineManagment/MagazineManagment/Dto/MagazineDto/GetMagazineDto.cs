using MagazineManagment.Dto.ArticleDto;

namespace MagazineManagment.Dto.MagazineDto
{
    public class GetMagazineDto : MagazineBaseDto
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Optionally include articles or a count
        public List<GetArticleDto> Articles { get; set; } = new List<GetArticleDto>();
    }
}
