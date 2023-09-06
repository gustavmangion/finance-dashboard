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
        }
    }
}
