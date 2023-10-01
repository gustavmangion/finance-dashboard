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

        public UserShare? GetUserShare(int inviteCode)
        {
            return _context.UserShares.Where(x => x.InviteCode == inviteCode).FirstOrDefault();
        }

        public List<UserShare> GetShares(string userId)
        {
            return _context.UserShares.Where(x => x.UserId == userId).ToList();
        }

        public void AddShare(UserShare share)
        {
            _context.UserShares.Add(share);
        }

        public void DeleteShare(UserShare share)
        {
            _context.UserShares.Remove(share);
        }

        public UserShareCode? GetShareCode(string userId)
        {
            return _context.UserShareCodes.Where(x => x.UserID == userId).FirstOrDefault();
        }

        public bool AliasExists(string alias, string userId)
        {
            return _context.UserShares.Where(x => x.Alias == alias && x.UserId == userId).Any();
        }

        public bool InviteCodeExists(int code)
        {
            return _context.UserShares.Where(x => x.InviteCode == code).Any();
        }

        public void AddShareCode(UserShareCode shareCode)
        {
            _context.UserShareCodes.Add(shareCode);
        }

        public bool SaveChanges()
        {
            return _context.SaveChanges() >= 0;
        }
    }
}
