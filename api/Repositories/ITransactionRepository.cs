using api.Entities;

namespace api.Repositories
{
    public interface ITransactionRepository
    {
        List<Transaction> GetTransactions(Guid accountId);
    }
}
