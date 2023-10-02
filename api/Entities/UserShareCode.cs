using System.ComponentModel.DataAnnotations;

namespace api.Entities
{
    public class UserShareCode
    {
        [Key]
        public string UserID { get; set; }
        public string EncryptedCode { get; set; }
    }
}
