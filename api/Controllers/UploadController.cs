using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UploadController : Controller
    {
        [HttpPost("UploadStatement")]
        public ActionResult UploadStatement(testDTO model)
        {
            return Ok();
        }
    }
}
public class testDTO {
    public string account = "";
}
