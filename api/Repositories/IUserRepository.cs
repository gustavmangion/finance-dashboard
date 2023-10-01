using api.Entities;

namespace api.Repositories
{
    public interface IUserRepository
    {
        User? GetUser(string id);
        bool UserExists(string id);
        void AddUser(User user);
        List<UserShare> GetShares(string id);
        void AddShare(UserShare share);
        void DeleteShare(UserShare share);
        bool SaveChanges();
    }
}
