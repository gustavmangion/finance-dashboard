using api.Entities;

namespace api.Repositories
{
    public interface IAccountRepository
    {
        List<Account> GetAccounts(string userId);
        void AddAccount(Account account);
        bool AccountNameExists(string name, Guid portfolioId);
        Statement GetStatement(Guid id);
        void AddStatement(Statement statement);
        bool StatementAlreadyUploaded(Guid accountId, DateOnly from, DateOnly to);
        void AddStatementAccount(StatementAccount statementAccount);
        void AddTransactions(List<Transaction> transactions);
        void AddStatementCode(StatementCode statementCode);
        List<StatementCode> GetStatementCodes(string userId);
        bool PendingStatementExists(string userId, Guid id);
        bool SaveChanges();
    }
}
