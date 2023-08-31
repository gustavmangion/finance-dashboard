namespace api.Models
{
    public class UserModel
    {
        public string Id { get; set; }
        public DateOnly Joined { get; set; }
        public bool SetupNeeded { get; set; }
    }
}
