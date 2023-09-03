using api.Entities;
using api.Models;
using api.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security;
using UglyToad.PdfPig;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class UploadController : BaseController
    {
        private readonly ILogger<UploadController> _logger;
        private readonly IAccountRepository _accountRepository;

        public UploadController(
            ILogger<UploadController> logger,
            IAccountRepository accountRepository
        )
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _accountRepository =
                accountRepository ?? throw new ArgumentNullException(nameof(accountRepository));
        }

        [HttpPost("UploadStatement")]
        public ActionResult UploadStatement([FromForm] IFormFile file)
        {
            if (file == null || file.Length < 0)
                ModelState.AddModelError("message", "File is missing or corrupt");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            string userId = GetUserIdFromToken();

            List<string> passwords = _accountRepository
                .GetAccounts(userId)
                .Select(x => x.StatementCode)
                .ToList();

            string content = OpenStatementFile(file, passwords);

            if (string.IsNullOrEmpty(content))
                return Ok(HandleNewAccount(file, userId));

            return NoContent();
        }

        private StatementUploadResultModel HandleNewAccount(IFormFile file, string userId)
        {
            Statement statement = new Statement() { UserId = userId, };
            _accountRepository.AddStatement(statement);
            _accountRepository.SaveChanges();
            string path = Path.Combine(
                Directory.GetCurrentDirectory(),
                "WorkingDirectory",
                "StatementUploads",
                $"{statement.Id}.pdf"
            );
            using (Stream fileStream = new FileStream(path, FileMode.Create))
                file.CopyToAsync(fileStream);

            return new StatementUploadResultModel()
            {
                uploadId = statement.Id,
                isNewAccount = true
            };
        }

        private string OpenStatementFile(IFormFile file, List<string> passwords)
        {
            try
            {
                using (
                    PdfDocument document = PdfDocument.Open(
                        file.OpenReadStream(),
                        new ParsingOptions { Passwords = passwords }
                    )
                )
                {
                    return "content";
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
    }
}
