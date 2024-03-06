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

        public List<Transaction> GetTransactions(DateOnly? from, DateOnly? to)
        {
            IQueryable<Transaction> transactions = _context.Transactions;

            transactions = FilterByDates(transactions, from, to);

            return transactions.ToList();
        }

        public List<Transaction> GetCardTransactions(
            string cardNo,
            DateOnly? from = null,
            DateOnly? to = null
        )
        {
            IQueryable<Transaction> transactions = _context.Transactions.Where(
                x => x.CardNo.Equals(cardNo)
            );

            transactions = FilterByDates(transactions, from, to);

            return transactions.ToList();
        }

        public List<Transaction> GetVendorTransactions(
            string vendor,
            DateOnly? from = null,
            DateOnly? to = null
        )
        {
            IQueryable<Transaction> transactions = _context.Transactions.Where(
                x => x.Description.Equals(vendor)
            );

            transactions = FilterByDates(transactions, from, to);

            return transactions.ToList();
        }

        private IQueryable<Transaction> FilterByDates(
            IQueryable<Transaction> transactions,
            DateOnly? from,
            DateOnly? to
        )
        {
            if (from.HasValue)
                transactions = transactions.Where(x => from <= x.Date);
            if (to.HasValue)
                transactions = transactions.Where(x => x.Date <= to);

            return transactions;
        }
    }
}
