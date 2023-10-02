namespace api.Models
{
    public class PortfolioModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public bool IsOwner { get; set; }
    }
}
