using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DashboardController : ControllerBase
    {
        [HttpGet("Test", Name = "GetTestMessage")]
        public ActionResult<string> GetTestMessage() {
            object result = new
            {
                text = "Hello world"
            };
            return Ok(result);
        }
    }
}
