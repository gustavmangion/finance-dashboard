using api.Entities;

namespace api.Repositories
{
    public interface IPortfolioRepository
    {
        List<Portfolio> GetPortfolios(string userId);
    }
}
