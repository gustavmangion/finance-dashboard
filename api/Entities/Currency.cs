using System.ComponentModel.DataAnnotations.Schema;

namespace api.Entities
{
    public class Currency
    {
        public Guid Id { get; set; }
        public DateOnly Date { get; set; }
        public string From { get; set; }
        public string To { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal Value { get; set; }
    }
}
