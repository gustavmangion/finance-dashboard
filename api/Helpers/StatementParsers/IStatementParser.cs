using api.Entities;

namespace api.Helpers.StatementHelpers
{
    public interface IStatementParser
    {
        string Init(string content);
        (DateOnly, DateOnly) GetStatementDates(string content);
        List<string> GetAccountNumbers(string content);
        List<Account> GetAccountsWithTransactions(string content);
    }
}
