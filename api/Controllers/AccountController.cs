using api.Entities;
using api.Helpers;
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
    public class AccountController : BaseController
    {
        private readonly IMapper _mapper;
        private readonly IAccountRepository _accountRepository;
        private readonly IPortfolioRepository _portfolioRespository;

        public AccountController(
            IMapper mapper,
            IAccountRepository accountRepository,
            IPortfolioRepository portfolioRepository
        )
        {
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _accountRepository =
                accountRepository ?? throw new ArgumentNullException(nameof(accountRepository));
            _portfolioRespository =
                portfolioRepository ?? throw new ArgumentNullException(nameof(portfolioRepository));
        }

        [HttpPost]
        public ActionResult CreateAccount(AccountModelForCreation model)
        {
            string userId = GetUserIdFromToken();
            if (model.PortfolioId == new Guid())
                ModelState.AddModelError("message", "Portfolio Id is required");
            else if (!_portfolioRespository.PortfolioExists(userId, model.PortfolioId))
                ModelState.AddModelError("message", "Portfolio does not exists");
            else if (string.IsNullOrEmpty(model.Name))
                ModelState.AddModelError("message", "Account name is required");
            else if (_accountRepository.AccountNameExists(model.Name, model.PortfolioId))
                return BadRequest("Account name already exists in this portfolio");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            Account newAccount = new Account();
            newAccount.Name = model.Name;
            newAccount.AccountNumber = model.AccountNumber;
            newAccount.PortfolioId = model.PortfolioId;
            newAccount.BankName = "ADCB";
            _accountRepository.AddAccount(newAccount);

            _accountRepository.SaveChanges();

            return NoContent();
        }

        [HttpGet]
        public ActionResult GetAccounts()
        {
            return Ok(
                _mapper.Map<List<AccountModel>>(
                    _accountRepository.GetAccounts(GetUserIdFromToken()).OrderBy(x => x.Name)
                )
            );
        }

        [HttpGet("{id}")]
        public ActionResult GetAccount(Guid id)
        {
            if (_accountRepository.UserCanAccessAccount(id, GetUserIdFromToken()))
            {
                ModelState.AddModelError("message", "Account does not exist");
                return BadRequest(ModelState);
            }

            return Ok(_mapper.Map<AccountModel>(_accountRepository.GetAccount(id)));
        }

        [HttpPut("{id}")]
        public ActionResult UpdateAccount(Guid id, [FromBody] AccountForUpdateModel model)
        {
            if (_accountRepository.UserCanAccessAccount(id, GetUserIdFromToken()))
            {
                ModelState.AddModelError("message", "Account does not exist");
                return BadRequest(ModelState);
            }

            Account? account = _accountRepository.GetAccount(id);
#pragma warning disable CS8602 // Dereference of a possibly null reference.
            account.Name = model.Name;
#pragma warning restore CS8602 // Dereference of a possibly null reference.
            _accountRepository.SaveChanges();

            return Ok(_mapper.Map<AccountModel>(account));
        }
    }
}
