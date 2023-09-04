using api.Entities;
using System.Security;
using System.Security.Cryptography;
using System.Text;
using UglyToad.PdfPig;
using UglyToad.PdfPig.Content;

namespace api.Helpers
{
    public class StatementHelper
    {
        private static byte[] salt = Encoding.Unicode.GetBytes("WT7yGYvbg6");

        public static string EncryptPasscode(string passcode)
        {
            if (string.IsNullOrEmpty(passcode))
                return passcode;

            string encryptedCode = string.Empty;
            byte[] codeBytes = Encoding.Unicode.GetBytes(passcode);
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes rfc = new Rfc2898DeriveBytes(
                    AppSettingHelper.StatementCodeKey,
                    salt,
                    1000,
                    HashAlgorithmName.SHA256
                );
                encryptor.Key = rfc.GetBytes(32);
                encryptor.IV = rfc.GetBytes(16);

                using (MemoryStream stream = new MemoryStream())
                {
                    using (
                        CryptoStream cryptoStream = new CryptoStream(
                            stream,
                            encryptor.CreateEncryptor(),
                            CryptoStreamMode.Write
                        )
                    )
                    {
                        cryptoStream.Write(codeBytes, 0, codeBytes.Length);
                        cryptoStream.Close();
                    }
                    encryptedCode = Convert.ToBase64String(stream.ToArray());
                }
            }

            return encryptedCode;
        }

        private static string DecryptPasscode(string encryptedCode)
        {
            if (string.IsNullOrEmpty(encryptedCode))
                return string.Empty;

            SecureString decryptedCode = new SecureString();
            byte[] codeBytes = Convert.FromBase64String(encryptedCode);
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes rfc = new Rfc2898DeriveBytes(
                    AppSettingHelper.StatementCodeKey,
                    salt,
                    1000,
                    HashAlgorithmName.SHA256
                );
                encryptor.Key = rfc.GetBytes(32);
                encryptor.IV = rfc.GetBytes(16);

                using (MemoryStream stream = new MemoryStream())
                {
                    using (
                        CryptoStream cryptoStream = new CryptoStream(
                            stream,
                            encryptor.CreateEncryptor(),
                            CryptoStreamMode.Write
                        )
                    )
                    {
                        cryptoStream.Write(codeBytes, 0, codeBytes.Length);
                        cryptoStream.Close();
                    }

                    return Encoding.Unicode.GetString(stream.ToArray());
                }
            }
        }

        public static string OpenStatementFile(Stream fileStream, List<string> passwords)
        {
            List<string> decryptedPasswords = new List<string>();

            foreach (string passsword in passwords)
                decryptedPasswords.Add(DecryptPasscode(passsword));

            try
            {
                using (
                    PdfDocument document = PdfDocument.Open(
                        fileStream,
                        new ParsingOptions { Passwords = decryptedPasswords }
                    )
                )
                {
                    string content = string.Empty;
                    int pageCount = document.NumberOfPages;

                    for (int i = 1; i < pageCount; i++)
                    {
                        //Page numbering is 1 indexed
                        Page page = document.GetPage(i + 1);
                        content += page.Text;
                    }
                    return content;
                }
            }
            catch (Exception e)
            {
                if (
                    e.Message.Equals(
                        "The document was encrypted and none of the provided passwords were the user or owner password."
                    )
                )
                {
                    return string.Empty;
                }
                throw;
            }
        }

        public static List<Account> GetAccountsAndTransactions(string content)
        {
            return new List<Account>();
        }
    }
}
