using api.Entities;
using api.Models;

namespace api.Repositories
{
    public interface ICurrencyRepository
    {
        bool CurrencyExists(string currency);
        Currency? GetRate(string baseCurrency, string toCurrency);
        List<Currency> GetRates(string baseCurrency, List<string> currencies, DateOnly date);
        CurrencyTrendModel GetCurrenyTrend(string baseCurrency, string toCurrency);
    }
}
