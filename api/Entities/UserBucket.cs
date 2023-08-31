namespace api.Entities
{
    public class UserBucket
    {
        public string UserId { get; set; }
        public virtual User User { get; set; }
        public Guid BucketId { get; set; }
        public virtual Bucket Bucket { get; set; }
    }
}
