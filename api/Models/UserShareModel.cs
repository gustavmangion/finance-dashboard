namespace api.Models
{
    public class UserShareModel
    {
        public bool ShareCodeSetup { get; set; }
        public List<UserShareModelShares> UserShares { get; set; } =
            new List<UserShareModelShares>();
    }

    public class UserShareModelShares
    {
        public Guid Id { get; set; }
        public string Alias { get; set; }
        public int InviteCode { get; set; }
        public bool? Revoked { get; set; }
    }
}
