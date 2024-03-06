using api.Entities;
using api.Helpers;
using api.ResourceParameters;

namespace api.Repositories
{
    public interface ITransactionRepository
    {
        PagedList<Transaction> GetTransactions(TransactionResourceParameters resourceParameters);
        List<Transaction> GetCardTransactions(
            string cardNo,
            DateOnly? from = null,
            DateOnly? to = null
        );

        List<Transaction> GetVendorTransactions(
            string vendor,
            DateOnly? from = null,
            DateOnly? to = null
        );
    }
}
