using MagazineManagment.Dto.ArticleDto;
using MagazineManagment.Dto.MagazineDto;
namespace MagazineManagment.Dto.AuthDto
{
    public class UserDetailDto : UserDto
    {
        public List<GetArticleDto> Articles { get; set; } = new();
        public List<GetMagazineDto> Magazines { get; set; } = new();
    }
}
