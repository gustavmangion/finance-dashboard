using api.Models;
using api.Repositories;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class PortfolioController : BaseController
    {
        private readonly IMapper _mapper;
        private readonly IPortfolioRepository _portfolioRepository;

        public PortfolioController(IMapper mapper, IPortfolioRepository portfolioRepository)
        {
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _portfolioRepository =
                portfolioRepository ?? throw new ArgumentNullException(nameof(portfolioRepository));
        }

        [HttpGet]
        public ActionResult GetPortfolios()
        {
            return Ok(
                _mapper.Map<List<PortfolioModel>>(
                    _portfolioRepository.GetPortfolios(GetUserIdFromToken())
                )
            );
        }
    }
}
