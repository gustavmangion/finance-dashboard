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

        public List<Account> GetAccounts(string userId)
        {
            return _context.UserPortfolios
                .Where(x => x.UserId == userId)
                .Select(x => x.Portfolio)
                .SelectMany(x => x.Accounts)
                .ToList();
        }

        public void AddAccount(Account account)
        {
            _context.Accounts.Add(account);
        }

        public bool AccountNameExists(string name, Guid portfolioId)
        {
            return _context.Accounts
                .Where(x => x.Name == name && x.PortfolioId == portfolioId)
                .Any();
        }

        public Statement? GetStatement(Guid id)
        {
            return _context.Statements.Where(x => x.Id == id).FirstOrDefault();
        }

        public Statement? GetPreviousStatement(DateOnly statementStartDate)
        {
            return _context.Statements.Where(x => x.To < statementStartDate).OrderByDescending(x => x.From).FirstOrDefault();
        }

        public void AddStatement(Statement statement)
        {
            _context.Statements.Add(statement);
        }

        public bool StatementAlreadyUploaded(
            Guid accountId,
            DateOnly from,
            DateOnly to,
            Statement? statement = null
        )
        {
            return _context.Accounts
                .Where(x => x.Id == accountId)
                .First()
                .AccountStatements.Select(xa => xa.Statement)
                .Where(xa => xa != statement)
                .Any(xs => xs.From == from && xs.To == to);
        }

        public void AddStatementAccount(StatementAccount statementAccount)
        {
            _context.StatementAccounts.Add(statementAccount);
        }

        public void AddTransactions(List<Transaction> transactions)
        {
            _context.Transactions.AddRange(transactions);
        }

        public void AddStatementCode(StatementCode statementCode)
        {
            _context.StatementCodes.Add(statementCode);
        }

        public List<StatementCode> GetStatementCodes(string userId)
        {
            return _context.StatementCodes.Where(x => x.UserId == userId).ToList();
        }

        public bool PendingStatementExists(string userId, Guid id)
        {
            return _context.Statements.Where(x => x.UserId == userId && x.Id == id).Any();
        }

        public bool SaveChanges()
        {
            return _context.SaveChanges() >= 0;
        }
    }
}
