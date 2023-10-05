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

        public Currency GetRate(string currency)
        {
            return _context.Currencies
                .Where(x => x.From == currency)
                .OrderByDescending(x => x.Date)
                .First();
        }

        public CurrencyTrendModel GetCurrenyTrend(string currency)
        {
            CurrencyTrendModel model = new CurrencyTrendModel();
            model.Current = GetRate(currency).Value;
            model.Highest = _context.Currencies
                .Where(x => x.From == currency)
                .OrderByDescending(x => x.Value)
                .First()
                .Value;
            model.Lowest = _context.Currencies
                .Where(x => x.From == currency)
                .OrderBy(x => x.Value)
                .First()
                .Value;

            return model;
        }
    }
}
