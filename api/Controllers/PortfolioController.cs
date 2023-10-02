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
        private readonly IUserRepository _userRepository;

        public PortfolioController(
            IMapper mapper,
            IPortfolioRepository portfolioRepository,
            IUserRepository userRepository
        )
        {
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _portfolioRepository =
                portfolioRepository ?? throw new ArgumentNullException(nameof(portfolioRepository));
            _userRepository =
                userRepository ?? throw new ArgumentNullException(nameof(userRepository));
        }

        [HttpGet]
        public ActionResult GetPortfolios()
        {
            string userId = GetUserIdFromToken();

            List<Portfolio> portfolios = _portfolioRepository.GetPortfolios(userId);

            foreach (Portfolio portfolio in portfolios)
                if (portfolio.OwnerId == userId)
                    portfolio.IsOwner = true;

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
            portfolio.OwnerId = userId;
            portfolio.UserPortfolios.Add(
                new UserPortfolio() { UserId = userId, Name = model.Name }
            );

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

            UserPortfolio userPortfolio = _portfolioRepository
                .GetPortfolio(id)
                .UserPortfolios.Where(x => x.UserId == userId)
                .First();
            userPortfolio.Name = model.Name;
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

            if (portfolio.OwnerId != GetUserIdFromToken())
                return Unauthorized();

            _portfolioRepository.DeletePortfolio(portfolio);
            _portfolioRepository.SaveChanges();

            return Ok();
        }

        [HttpGet("Share/{id}")]
        public ActionResult GetPortfolioShares(Guid id)
        {
            string userId = GetUserIdFromToken();

            if (!_portfolioRepository.PortfolioExists(userId, id))
            {
                ModelState.AddModelError("message", "Portfolio does not exist");
                return BadRequest(ModelState);
            }

            Portfolio portfolio = _portfolioRepository.GetPortfolio(id);

            return Ok(
                _mapper.Map<List<PortfolioShareModel>>(
                    portfolio.UserPortfolios.Where(x => x.UserId != userId)
                )
            );
        }

        [HttpGet("ShareableWith/{id}")]
        public ActionResult GetPortfolioShareableWith(Guid id)
        {
            string userId = GetUserIdFromToken();

            if (!_portfolioRepository.PortfolioExists(userId, id))
            {
                ModelState.AddModelError("message", "Portfolio does not exist");
                return BadRequest(ModelState);
            }

            List<UserPortfolio> portfolioShares = _portfolioRepository
                .GetPortfolio(id)
                .UserPortfolios;
            List<UserShare> notLinkeduserShares = _userRepository
                .GetShares(userId)
                .Where(x => !x.UserPortfolios.Any(y => portfolioShares.Contains(y)))
                .ToList();

            return Ok(_mapper.Map<List<UserShareBasicModel>>(notLinkeduserShares));
        }

        [HttpPost("Share")]
        public ActionResult CreatePortfolioShare(PortfolioShareForCreateModel model)
        {
            string userId = GetUserIdFromToken();

            if (!_portfolioRepository.PortfolioExists(userId, model.PortfolioId))
                ModelState.AddModelError("message", "Portfolio does not exist");

            UserShare? userShare = _userRepository.GetUserShare(model.ShareId);
            if (userShare == null || userShare.UserId != userId)
                ModelState.AddModelError("message", "Share does not exist");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            Portfolio portfolio = _portfolioRepository.GetPortfolio(model.PortfolioId);

            UserPortfolio userPortfolio = new UserPortfolio();
            userPortfolio.UserShareId = model.ShareId;
            userPortfolio.PortfolioId = model.PortfolioId;
            userPortfolio.Name = portfolio.UserPortfolios
                .Where(x => x.UserId == userId)
                .First()
                .Name;

#pragma warning disable CS8602 // Dereference of a possibly null reference.
            if (userShare.SharedWith != null)
                userPortfolio.UserId = userShare.SharedWith;
#pragma warning restore CS8602 // Dereference of a possibly null reference.

            _portfolioRepository.AddUserPortfolio(userPortfolio);
            _portfolioRepository.SaveChanges();

            return Ok();
        }

        [HttpDelete("Share/{id}")]
        public ActionResult DeletePortfolioShare(Guid id)
        {
            if (!_portfolioRepository.UserPortfolioExists(GetUserIdFromToken(), id))
            {
                ModelState.AddModelError("message", "Portfolio share does not exist");
                return BadRequest(ModelState);
            }

            UserPortfolio userPortfolio = _portfolioRepository.GetUserPortfolio(id);
            _portfolioRepository.DeleteUserPortfolio(userPortfolio);
            _portfolioRepository.SaveChanges();

            return Ok();
        }
    }
}
