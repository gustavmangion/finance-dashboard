using api.Entities;

namespace api.Repositories
{
    public interface IPortfolioRepository
    {
        List<Portfolio> GetPortfolios(string userId);
        Portfolio GetPortfolio(Guid id);
        UserPortfolio GetUserPortfolio(Guid id);
        void AddPortfolio(Portfolio portfolio);
        void AddUserPortfolio(UserPortfolio userPortfolio);
        void DeletePortfolio(Portfolio portfolio);
        void DeleteUserPortfolio(UserPortfolio userPortfolio);
        void DeleteUserPortfolios(List<UserPortfolio> userPortfolios);
        bool PortfolioExists(string userId, Guid id);
        bool UserPortfolioExists(string userId, Guid id);
        bool PortfolioNameExists(string userId, string name, Guid currentPortfolio);
        bool PortfolioHasAccounts(Guid id);
        bool SaveChanges();
    }
}
