using api.Contexts;
using api.Entities;

namespace api.Repositories
{
    public class AccountRepository : IAccountRepository
    {
        private readonly APIDBContext _context;

        public AccountRepository(APIDBContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public void AddStatement(Statement statement)
        {
            _context.Statements.Add(statement);
        }

        public List<Account> GetAccounts(string userId)
        {
            return _context.UserPortfolios
                .Where(x => x.UserId == userId)
                .Select(x => x.Portfolio)
                .SelectMany(x => x.Accounts)
                .ToList();
        }

        public bool SaveChanges()
        {
            return _context.SaveChanges() >= 0;
        }
    }
}
