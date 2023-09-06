namespace api.Models
{
    public class StatementUploadResultModel
    {
        public Guid uploadId { get; set; }
        public bool needPassword { get; set; }
        public List<string> accountsToSetup { get; set; } = new List<string>();
        public bool StatementAlreadyUploaded { get; set; }
    }
}
