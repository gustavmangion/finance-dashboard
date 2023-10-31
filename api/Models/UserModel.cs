using System.ComponentModel;

namespace api.Models
{
    public class UserModel
    {
        public string Id { get; set; }
        public UserStatus UserStatus { get; set; }
        public string BaseCurrency { get; set; }
    }

    public enum UserStatus
    {
        Ok,
        NotCreated,
        NeedStatement,
    }
}
