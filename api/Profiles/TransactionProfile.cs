using api.Entities;
using api.Models;
using AutoMapper;

namespace api.Profiles
{
    public class TransactionProfile : Profile
    {
        public TransactionProfile()
        {
            CreateMap<Transaction, TransactionModel>()
                .ForMember(dest => dest.TranDate, opt => opt.MapFrom(src => src.Date.ToString()));
        }
    }
}
