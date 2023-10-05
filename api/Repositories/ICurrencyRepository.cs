using api.Entities;
using api.Models;

namespace api.Repositories
{
    public interface ICurrencyRepository
    {
        Currency? GetRate(string currency);
        CurrencyTrendModel GetCurrenyTrend(string currency);
    }
}
