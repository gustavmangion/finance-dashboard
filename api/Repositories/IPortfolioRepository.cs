using api.Entities;

namespace api.Repositories
{
    public interface IPortfolioRepository
    {
        List<Portfolio> GetPortfolios(string userId);
        Portfolio GetPortfolio(Guid id);
        bool PortfolioExists(string userId, Guid id);
        bool PortfolioNameExists(string userId, string name, Guid currentPortfolio);
        bool SaveChanges();
    }
}
