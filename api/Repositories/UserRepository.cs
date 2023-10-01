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

        public bool UserExists(string id)
        {
            return _context.Users.Where(x => x.Id == id).Any();
        }

        public void AddUser(User user)
        {
            _context.Users.Add(user);
        }

        public bool SaveChanges()
        {
            return _context.SaveChanges() >= 0;
        }

        public List<UserShare> GetShares(string id)
        {
            return _context.UserShares.Where(x => x.UserId == id).ToList();
        }

        public void AddShare(UserShare share)
        {
            _context.UserShares.Add(share);
        }

        public void DeleteShare(UserShare share)
        {
            _context.UserShares.Remove(share);
        }
    }
}
