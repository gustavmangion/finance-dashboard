using api.Entities;
using AutoMapper;

namespace api.Profiles
{
    public class AccountProfile : Profile
    {
        public AccountProfile()
        {
            CreateMap<Account, AccountProfile>();
        }
    }
}
