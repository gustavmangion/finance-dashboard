using api.Entities;
using api.Helpers;
using api.Models;
using api.Repositories;
using api.ResourceParameters;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

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

        [HttpGet("transactions", Name = "Transactions")]
        public ActionResult GetAccountTransactions(
            [FromQuery] TransactionResourceParameters resouceParamters
        )
        {
            if (
                (!resouceParamters.From.HasValue && resouceParamters.To.HasValue)
                || (resouceParamters.From.HasValue && !resouceParamters.To.HasValue)
            )
                ModelState.AddModelError(
                    "message",
                    "From and To date are both required when filtering by date"
                );
            else if (
                resouceParamters.From.HasValue
                && resouceParamters.To.HasValue
                && resouceParamters.From.Value >= resouceParamters.To.Value
            )
                ModelState.AddModelError("message", "From must be less than To");
            else if (
                !_accountRepository.UserCanAccessAccount(
                    resouceParamters.AccountId,
                    GetUserIdFromToken()
                )
            )
                ModelState.AddModelError("message", "Account does not exist");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            PagedList<Transaction> transactions = _transactionRepository.GetTransactions(
                resouceParamters
            );

            PaginationModel<TransactionModel> paginationModel =
                PaginationModel<TransactionModel>.Create(
                    _mapper.Map<List<TransactionModel>>(transactions),
                    transactions.TotalCount,
                    transactions.TotalPages,
                    resouceParamters.PageNumber,
                    resouceParamters.PageSize
                );

            return Ok(paginationModel);
        }
    }
}
