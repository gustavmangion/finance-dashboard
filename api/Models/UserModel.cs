namespace api.Models
{
    public class UserModel
    {
        public BasicUserModel User { get; set; }
        public List<PortfolioModel> Portfolios { get; set; }
    }
}
