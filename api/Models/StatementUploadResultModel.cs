namespace api.Models
{
    public class StatementUploadResultModel
    {
        public Guid UploadId { get; set; }
        public bool NeedPassword { get; set; }
        public bool NeedBankName { get; set; }
        public List<string> AccountsToSetup { get; set; } = new List<string>();
        public bool StatementAlreadyUploaded { get; set; }
    }
}
