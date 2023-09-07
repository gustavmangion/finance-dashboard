namespace api.Entities
{
    public class UserPortfolio
    {
        public string UserId { get; set; }
        public virtual User User { get; set; }
        public Guid PortfolioId { get; set; }
        public virtual Portfolio Portfolio { get; set; }
    }
}
