namespace api.Entities
{
    public class StatementCode
    {
        public Guid Id { get; set; }
        public string UserId { get; set; }
        public virtual User User { get; set; }
        public string Code { get; set; }
    }
}
