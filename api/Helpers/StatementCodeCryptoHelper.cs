using System.Security;
using System.Security.Cryptography;
using System.Text;

namespace api.Helpers
{
    public class StatementCodeCryptoHelper
    {
        private static byte[] salt = Encoding.Unicode.GetBytes("WT7yGYvbg6");

        public static string EncryptPasscode(string passcode)
        {
            if(string.IsNullOrEmpty(passcode))  return passcode; 

            string encryptedCode = string.Empty;
            byte[] codeBytes = Encoding.Unicode.GetBytes(passcode);
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes rfc = new Rfc2898DeriveBytes(AppSettingHelper.StatementCodeKey, salt, 1000, HashAlgorithmName.SHA256);
                encryptor.Key = rfc.GetBytes(32);
                encryptor.IV = rfc.GetBytes(16);

                using(MemoryStream stream = new MemoryStream())
                {
                    using (CryptoStream cryptoStream = new CryptoStream(stream, encryptor.CreateEncryptor(), CryptoStreamMode.Write))
                    {
                        cryptoStream.Write(codeBytes, 0, codeBytes.Length);
                        cryptoStream.Close();
                    }
                    encryptedCode = Convert.ToBase64String(stream.ToArray());
                }
            }

            return encryptedCode;
        }

        public static SecureString? DecryptPasscode(string encryptedCode)
        {
            if (string.IsNullOrEmpty(encryptedCode)) return null;

            SecureString decryptedCode = new SecureString();
            byte[] codeBytes = Convert.FromBase64String(encryptedCode);
            using(Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes rfc = new Rfc2898DeriveBytes(AppSettingHelper.StatementCodeKey, salt, 1000, HashAlgorithmName.SHA256);
                encryptor.Key = rfc.GetBytes(32);
                encryptor.IV = rfc.GetBytes(16);

                using (MemoryStream stream = new MemoryStream())
                {
                    using (CryptoStream cryptoStream = new CryptoStream(stream, encryptor.CreateEncryptor(), CryptoStreamMode.Write))
                    {
                        cryptoStream.Write(codeBytes, 0, codeBytes.Length);
                        cryptoStream.Close();
                    }

                    foreach(char c in Encoding.Unicode.GetChars(stream.ToArray()))
                        decryptedCode.AppendChar(c);
                }

                return decryptedCode;
            }
        }
    }
}
