using api.Entities;
using api.Models;
using AutoMapper;

namespace api.Profiles
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<User, UserModel>();
        }
    }
}
