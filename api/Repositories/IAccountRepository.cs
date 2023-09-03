using api.Entities;

namespace api.Repositories
{
    public interface IAccountRepository
    {
        List<Account> GetAccounts(string userId);
        void AddStatement(Statement statement);
        bool SaveChanges();
    }
}
