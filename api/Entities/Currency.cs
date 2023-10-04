namespace api.Entities
{
    public class Currency
    {
        public Guid Id { get; set; }
        public DateOnly Date { get; set; }
        public string From { get; set; }
        public string To { get; set; }
        public decimal Value { get; set; }
    }
}
