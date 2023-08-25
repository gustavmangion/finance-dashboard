using api.Contexts;
using api.Entities;

namespace api.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly APIDBContext _context;

        public UserRepository(APIDBContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public User? GetUser(string id)
        {
            return _context.Users.Where(x => x.Id == id).FirstOrDefault();
        }
    }
}
