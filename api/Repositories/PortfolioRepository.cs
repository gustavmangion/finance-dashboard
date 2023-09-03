using api.Contexts;
using api.Entities;

namespace api.Repositories
{
    public class PortfolioRepository : IPortfolioRepository
    {
        private readonly APIDBContext _context;

        public PortfolioRepository(APIDBContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public List<Portfolio> GetPortfolios(string userId)
        {
            return _context.UserPortfolios
                .Where(x => x.UserId == userId)
                .Select(x => x.Portfolio)
                .ToList();
        }
    }
}
