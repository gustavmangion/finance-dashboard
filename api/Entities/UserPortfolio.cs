namespace api.Entities
{
    public class UserPortfolio
    {
        public Guid Id { get; set; }
        public string? UserId { get; set; }
        public virtual User? User { get; set; }
        public Guid PortfolioId { get; set; }
        public virtual Portfolio Portfolio { get; set; }
        public Guid? UserShareId { get; set; }
        public virtual UserShare? UserShare { get; set; }
    }
}
