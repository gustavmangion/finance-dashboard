namespace api.Entities
{
    public class Statement
    {
        public Guid Id { get; set; }
        public Guid AccountId { get; set; }
        public virtual Account Account { get; set; }
        public DateTime UploadedAt { get; set; }
    }
}
