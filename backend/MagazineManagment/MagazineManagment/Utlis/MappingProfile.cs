using AutoMapper;
using MagazineManagment.Model;
using MagazineManagment.Dto.ArticleDto;
using MagazineManagment.Dto.MagazineDto;
using Microsoft.AspNetCore.Identity;
using MagazineManagment.Dto.AuthDto;

namespace MagazineManagment.Utlis
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Entity <-> DTO mappings
            CreateMap<Article, GetArticleDto>()
               .ForMember(dest => dest.AuthorName, opt => opt.MapFrom(src =>
                   src.AuthorUser != null ? src.AuthorUser.Email : "Unknown"));
            CreateMap<Article, GetArticleWithMagazineDto>()
                .ForMember(dest => dest.MagazineName, opt => opt.MapFrom(src => src.Magazine != null? src.Magazine.Title:string.Empty))
                .ForMember(dest => dest.AuthorName, opt => opt.MapFrom(src => src.AuthorUser != null ? src.AuthorUser.UserName : string.Empty));
            CreateMap<Article, GetArticleSummaryDto>()
                .ForMember(dest => dest.MagazineName, opt => opt.MapFrom(src => src.Magazine != null ? src.Magazine.Title : string.Empty));
            CreateMap<GetArticleDto, GetArticleSummaryDto>();
            //CreateMap<GetArticleDto, GetArticleWithMagazineDto>();
            CreateMap<AddArticleDto, Article>();
            CreateMap<UpdateArticleDto, Article>();
            // Add Magazine mappings similarly if needed
            CreateMap<Magazine, GetMagazineDto>()
                .ForMember(dest => dest.CreatedByName, opt => opt.MapFrom(src =>
                    src.Creator != null ? src.Creator.Email : "Unknown"))
                .ForMember(dest => dest.Articles, opt => opt.MapFrom(src => src.Articles));
            CreateMap<Magazine, GetMagazinesDto>();
            CreateMap<AddMagazineDto, Magazine>();
            CreateMap<UpdateMagazineDto, Magazine>();

            // User mappings
            CreateMap<IdentityUser, UserDto>()
                .ForMember(dest => dest.CreatedDate, opt => opt.MapFrom(src => src.LockoutEnd));

            CreateMap<IdentityUser, UserDetailDto>()
                .ForMember(dest => dest.CreatedDate, opt => opt.MapFrom(src => src.LockoutEnd));
        }
    }
}
