using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class UploadController : Controller
    {
        [HttpPost("UploadStatement")]
        public ActionResult UploadStatement(testDTO model)
        {
            return NoContent();
        }
    }
}
public class testDTO {
    public string account = "";
}
