using api.Contexts;
using api.Entities;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly APIDBContext _apiContext;

        public DashboardController(APIDBContext apiContext)
        {
            _apiContext = apiContext ?? throw new ArgumentNullException(nameof(apiContext));
        }

        [HttpGet("Test", Name = "GetTestMessage")]
        public ActionResult<string> GetTestMessage()
        {
            Test test = _apiContext.Tests.FirstOrDefault();

            object result = new { text = test.Message };
            return Ok(result);
        }
    }
}
