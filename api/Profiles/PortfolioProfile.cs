using api.Entities;
using api.Models;
using AutoMapper;

namespace api.Profiles
{
    public class PortfolioProfile : Profile
    {
        public PortfolioProfile()
        {
            CreateMap<Portfolio, PortfolioModel>();
            CreateMap<UserPortfolio, PortfolioShareModel>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.UserShare.Id))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.UserShare.Alias));
        }
    }
}
