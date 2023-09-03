using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class UploadController : Controller
    {
        private readonly ILogger<UploadController> _logger;

        public UploadController(ILogger<UploadController> logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [HttpPost("UploadStatement")]
        public ActionResult UploadStatement([FromForm] IFormFile file)
        {
            return NoContent();
        }
    }
}

public class testDTO
{
    public string account = "";
}
