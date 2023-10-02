using api.Contexts;
using api.Entities;
using Microsoft.EntityFrameworkCore;

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

        public Portfolio GetPortfolio(Guid id)
        {
            return _context.Portfolios.Where(x => x.Id == id).First();
        }

        public void AddPortfolio(Portfolio portfolio)
        {
            _context.Add(portfolio);
        }

        public void AddUserPortfolio(UserPortfolio userPortfolio)
        {
            _context.UserPortfolios.Add(userPortfolio);
        }

        public void DeletePortfolio(Portfolio portfolio)
        {
            _context.UserPortfolios.RemoveRange(portfolio.UserPortfolios);
            _context.Portfolios.Remove(portfolio);
        }

        public void DeleteUserPortfolios(List<UserPortfolio> userPortfolios)
        {
            _context.UserPortfolios.RemoveRange(userPortfolios);
        }

        public bool PortfolioExists(string userId, Guid id)
        {
            return _context.UserPortfolios
                .Where(x => x.UserId == userId && x.PortfolioId == id)
                .Any();
        }

        public bool PortfolioNameExists(string userId, string name, Guid currentPortfolio)
        {
            return _context.UserPortfolios
                .Where(
                    x =>
                        x.UserId == userId
                        && x.Portfolio.Name == name
                        && x.PortfolioId != currentPortfolio
                )
                .Any();
        }

        public bool PortfolioHasAccounts(Guid id)
        {
            return _context.Accounts.Where(x => x.PortfolioId == id).Any();
        }

        public bool SaveChanges()
        {
            return _context.SaveChanges() >= 0;
        }
    }
}
