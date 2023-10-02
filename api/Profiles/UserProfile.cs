using api.Entities;
using api.Helpers;
using api.Models;
using AutoMapper;

namespace api.Profiles
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<User, UserModel>();
            CreateMap<UserShare, UserShareModelShares>();
            CreateMap<UserShareCode, UserShareCodeModel>()
                .ForMember(
                    dest => dest.Code,
                    opt => opt.MapFrom(src => EncryptionHelper.DecryptString(src.EncryptedCode))
                );
            CreateMap<UserShare, UserShareBasicModel>();
        }
    }
}
