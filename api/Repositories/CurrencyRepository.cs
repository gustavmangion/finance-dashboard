using api.Contexts;
using api.Entities;
using api.Models;

namespace api.Repositories
{
    public class CurrencyRepository : ICurrencyRepository
    {
        private readonly APIDBContext _context;

        public CurrencyRepository(APIDBContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public bool CurrencyExists(string currency)
        {
            return _context.Currencies.Where(x => x.From == currency).Any();
        }

        public Currency GetRate(string baseCurrency, string toCurrency)
        {
            return _context.Currencies
                .Where(x => x.From == baseCurrency && x.To == toCurrency)
                .OrderByDescending(x => x.Date)
                .First();
        }

        public List<Currency> GetRates(string baseCurrency, List<string> currencies, DateOnly date)
        {
            return _context.Currencies
                .Where(x => x.From == baseCurrency && currencies.Contains(x.To) && x.Date == date)
                .ToList();
        }

        public CurrencyTrendModel GetCurrenyTrend(string baseCurrency, string toCurrency)
        {
            CurrencyTrendModel model = new CurrencyTrendModel();
            model.Current = GetRate(baseCurrency, toCurrency).Value;
            model.Highest = _context.Currencies
                .Where(x => x.From == baseCurrency && x.To == toCurrency)
                .OrderByDescending(x => x.Value)
                .First()
                .Value;
            model.Lowest = _context.Currencies
                .Where(x => x.From == baseCurrency && x.To == toCurrency)
                .OrderBy(x => x.Value)
                .First()
                .Value;

            return model;
        }
    }
}
