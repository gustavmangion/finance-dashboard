using api.Entities;
using api.Models;
using AutoMapper;

namespace api.Profiles
{
    public class AccountProfile : Profile
    {
        public AccountProfile()
        {
            CreateMap<Account, AccountModel>();
        }
    }
}
