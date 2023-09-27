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

            IQueryable<Transaction> transactions = _context.Transactions.Where(
                x => x.AccountId == resourceParameters.AccountId
            );

            if (resourceParameters.From.HasValue && resourceParameters.To.HasValue)
                transactions = transactions.Where(
                    x =>
                        x.Date >= resourceParameters.From.Value
                        && x.Date <= resourceParameters.To.Value
                );

            if (resourceParameters.Category.Count > 0)
                transactions = transactions.Where(
                    x => resourceParameters.Category.Contains(x.Category)
                );

            return PagedList<Transaction>.Create(
                transactions.OrderByDescending(x => x.Date).ToList(),
                resourceParameters.PageNumber,
                resourceParameters.PageSize
            );
        }
    }
}
