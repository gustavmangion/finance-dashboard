using api.Entities;
using api.Models;
using AutoMapper;

namespace api.Profiles
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<User, BasicUserModel>();
            CreateMap<User, UserModel>()
                .ForMember(dest => dest.User, opt => opt.MapFrom(src => src))
                .ForMember(dest => dest.Portfolios, opt => opt.MapFrom( src => src.UserPortfolios.Select(x => x.Portfolio)));
        }
    }
}
