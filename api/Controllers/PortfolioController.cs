using api.Entities;
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

        [HttpPost]
        public ActionResult CreatePortfilio([FromBody] PortfolioModelForCreation model)
        {
            string userId = GetUserIdFromToken();

            if (_portfolioRepository.PortfolioNameExists(userId, model.Name, new Guid()))
                return BadRequest("Name already used");

            if (string.IsNullOrEmpty(model.Name))
                ModelState.AddModelError("message", "Name is required");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            Portfolio portfolio = new Portfolio();
            portfolio.Name = model.Name;
            portfolio.UserPortfolios.Add(new UserPortfolio() { UserId = userId });

            _portfolioRepository.AddPortfolio(portfolio);
            _portfolioRepository.SaveChanges();

            return Ok(portfolio);
        }

        [HttpPut("{id}")]
        public ActionResult UpdatePortfolio(Guid id, [FromBody] PortfolioForUpdateModel model)
        {
            string userId = GetUserIdFromToken();
            if (!_portfolioRepository.PortfolioExists(userId, id))
                ModelState.AddModelError("message", "Portfolio does not exist");
            else if (string.IsNullOrEmpty(model.Name))
                ModelState.AddModelError("message", "Name is required");
            else if (_portfolioRepository.PortfolioNameExists(userId, model.Name, id))
                return BadRequest("Name already used");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            Portfolio portfolio = _portfolioRepository.GetPortfolio(id);
            portfolio.Name = model.Name;
            _portfolioRepository.SaveChanges();

            return Ok();
        }

        [HttpDelete("{id}")]
        public ActionResult DeletePortfolio(Guid id)
        {
            if (!_portfolioRepository.PortfolioExists(GetUserIdFromToken(), id))
                ModelState.AddModelError("message", "Portfolio does not exist");
            else if (_portfolioRepository.PortfolioHasAccounts(id))
                return BadRequest("Portfolio has linked accounts");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            Portfolio portfolio = _portfolioRepository.GetPortfolio(id);
            _portfolioRepository.DeletePortfolio(portfolio);
            _portfolioRepository.SaveChanges();

            return Ok();
        }
    }
}
