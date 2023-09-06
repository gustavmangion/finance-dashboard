using api.Entities;

namespace api.Repositories
{
    public interface IAccountRepository
    {
        List<Account> GetAccounts(string userId);
        void AddAccount(Account account);
        bool AccountNameExists(string name, Guid portfolioId);
        Statement GetStatement(Guid id);
        Statement? GetPreviousStatement(DateOnly statementStartDate);
        Statement? GetNextStatement(DateOnly statementEndDate);
        void AddStatement(Statement statement);
        bool StatementAlreadyUploaded(
            Guid accountId,
            DateOnly from,
            DateOnly to,
            Statement? currentStatement = null
        );
        void AddStatementAccount(StatementAccount statementAccount);
        void AddTransactions(List<Transaction> transactions);
        void AddStatementCode(StatementCode statementCode);
        List<StatementCode> GetStatementCodes(string userId);
        bool PendingStatementExists(string userId, Guid id);
        void DeleteTransactions(List<Transaction> transactions);
        bool SaveChanges();
    }
}
