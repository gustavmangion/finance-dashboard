using api.Entities;

namespace api.Repositories
{
    public interface IUserRepository
    {
        User? GetUser(string id);
        bool UserExists(string id);
        void AddUser(User user);
        UserShare? GetUserShare(int inviteCode);
        List<UserShare> GetShares(string userId);
        void AddShare(UserShare share);
        void DeleteShare(UserShare share);
        UserShareCode? GetShareCode(string userId);
        bool AliasExists(string alias, string userId);
        bool InviteCodeExists(int code);
        void AddShareCode(UserShareCode shareCode);
        bool SaveChanges();
    }
}
