using api.Entities;

namespace api.Repositories
{
    public interface IUserRepository
    {
        User? GetUser(string id);
    }
}
