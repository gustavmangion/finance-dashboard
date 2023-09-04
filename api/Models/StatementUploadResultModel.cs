namespace api.Models
{
    public class StatementUploadResultModel
    {
        public Guid uploadId { get; set; }
        public bool needPassword { get; set; }
    }
}
