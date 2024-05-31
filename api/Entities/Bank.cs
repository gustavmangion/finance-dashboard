using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Entities
{
    public class Bank
    {
        [Key]
        public string Id { get; set; }
        public string Name { get; set; }
    }
}
