namespace api.Models
{
    public class AccountModelForCreation
    {
        public Guid UploadId { get; set; }
        public Guid PortfolioId { get; set; }
        public string Name { get; set; }
        public string StatementCode { get; set; }
    }
}
