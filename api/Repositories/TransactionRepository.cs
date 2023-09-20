using api.Contexts;
using api.Entities;
using api.Helpers;
using api.ResourceParameters;

namespace api.Repositories
{
    public class TransactionRepository : ITransactionRepository
    {
        private readonly APIDBContext _context;

        public TransactionRepository(APIDBContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public PagedList<Transaction> GetTransactions(
            TransactionResourceParameters resourceParameters
        )
        {
            if (resourceParameters == null)
                throw new ArgumentNullException(nameof(resourceParameters));

            List<Transaction> transactions = _context.Transactions
                .Where(x => x.AccountId == resourceParameters.AccountId)
                .OrderByDescending(x => x.Date)
                .ToList();

            return PagedList<Transaction>.Create(
                transactions,
                resourceParameters.PageNumber,
                resourceParameters.PageSize
            );
        }
    }
}
