using api.Entities;
using api.Models;
using AutoMapper;

namespace api.Profiles
{
    public class AccountProfile : Profile
    {
        public AccountProfile()
        {
            CreateMap<Account, AccountModel>()
                .ForMember(
                    dest => dest.Balance,
                    opt => opt.MapFrom(src => src.Transactions.Sum(x => x.Amount))
                )
                .ForMember(
                    dest => dest.TotalOut,
                    opt =>
                        opt.MapFrom(
                            src =>
                                Math.Abs(
                                    src.Transactions
                                        .Where(x => x.Type == TranType.Debit)
                                        .Sum(x => x.Amount)
                                )
                        )
                )
                .ForMember(
                    dest => dest.TotalIn,
                    opt =>
                        opt.MapFrom(
                            src =>
                                src.Transactions
                                    .Where(x => x.Type == TranType.Credit)
                                    .Sum(x => x.Amount)
                        )
                );
            ;

            CreateMap<Bank, BankModel>();
        }
    }
}
