using api.Entities;
using api.Helpers;
using api.ResourceParameters;

namespace api.Repositories
{
    public interface ITransactionRepository
    {
        PagedList<Transaction> GetTransactions(TransactionResourceParameters resourceParameters);
    }
}
