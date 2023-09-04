using api.Entities;

namespace api.Repositories
{
    public interface IAccountRepository
    {
        List<Account> GetAccounts(string userId);
        void AddAccount(Account account);
        Statement GetStatement(Guid id);
        void AddStatement(Statement statement);
        bool PendingStatementExists(string userId, Guid id);
        bool SaveChanges();
    }
}
