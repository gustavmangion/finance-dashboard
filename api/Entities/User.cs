namespace api.Entities
{
    public class User
    {
        public string Id { get; set; }
        public DateOnly Joined { get; set; } = new DateOnly();

        public virtual List<UserBucket> UserBuckets { get; set; } = new List<UserBucket> { };
    }
}
