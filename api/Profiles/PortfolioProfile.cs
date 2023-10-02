using api.Entities;
using api.Models;
using AutoMapper;

namespace api.Profiles
{
    public class PortfolioProfile : Profile
    {
        public PortfolioProfile()
        {
            CreateMap<Portfolio, PortfolioModel>()
                .ForMember(
                    dest => dest.Name,
                    opt =>
                        opt.MapFrom(
                            src =>
                                src.UserPortfolios.Where(x => x.PortfolioId == src.Id).First().Name
                        )
                );
            CreateMap<UserPortfolio, PortfolioShareModel>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.UserShare.Alias));
        }
    }
}
