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
    public class TransactionController : BaseController
    {
        private readonly IMapper _mapper;
        private readonly ITransactionRepository _transactionRepository;
        private readonly IAccountRepository _accountRepository;

        public TransactionController(
            IMapper mapper,
            ITransactionRepository transactionRepository,
            IAccountRepository accountRepository
        )
        {
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _transactionRepository =
                transactionRepository
                ?? throw new ArgumentNullException(nameof(transactionRepository));
            _accountRepository =
                accountRepository ?? throw new ArgumentNullException(nameof(accountRepository));
        }

        [HttpGet("account/{id}")]
        public ActionResult GetAccountTransactions(Guid id)
        {
            if (!_accountRepository.UserCanAccessAccount(id, GetUserIdFromToken()))
                ModelState.AddModelError("message", "Account does not exist");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(
                _mapper.Map<List<TransactionModel>>(_transactionRepository.GetTransactions(id))
            );
        }
    }
}
