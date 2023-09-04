namespace api.Models
{
    public class AccountsModelForCreation
    {
        public Guid UploadId { get; set; }
        public List<AccountModelForCreation> Accounts { get; set; }
    }
}
