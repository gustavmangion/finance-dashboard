using api.Entities;

namespace api.ResourceParameters
{
    public class TransactionResourceParameters : ResourceParametersBase
    {
        public Guid AccountId { get; set; }
        public DateOnly? From { get; set; }
        public DateOnly? To { get; set; }
        public List<TranCategory> Category { get; set; } = new List<TranCategory>();
    }
}
