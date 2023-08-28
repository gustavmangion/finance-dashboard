using api.Entities;

namespace api.Repositories
{
    public interface IUserRepository
    {
        User? GetUser(string id);
        bool UserExists(string id);
        void AddUser(User user);
        bool SaveChanges();
    }
}
