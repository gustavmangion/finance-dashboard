using api.Contexts;
using api.Entities;

namespace api.Repositories
{
    public class TransactionRepository : ITransactionRepository
    {
        private readonly APIDBContext _context;

        public TransactionRepository(APIDBContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public List<Transaction> GetTransactions(Guid accountId)
        {
            return _context.Transactions.Where(x => x.AccountId == accountId).ToList();
        }
    }
}
