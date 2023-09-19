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

            string? previousPageLink = transactions.HasPrevious
                ? CreateTransactionsResourceUri(resouceParamters, ResourceUriType.PreviousPage)
                : null;
            string? nextPageLink = transactions.HasPrevious
                ? CreateTransactionsResourceUri(resouceParamters, ResourceUriType.NextPage)
                : null;

            var paginationMetaData = new
            {
                totalCount = transactions.TotalCount,
                pageSize = transactions.PageSize,
                currentPage = transactions.CurrentPage,
                totalPages = transactions.TotalPages,
                previousPageLink,
                nextPageLink
            };

            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(paginationMetaData));

            return Ok(_mapper.Map<List<TransactionModel>>(transactions));
        }

        private string CreateTransactionsResourceUri(
            TransactionResourceParameters resourceParameters,
            ResourceUriType type
        )
        {
            switch (type)
            {
                case ResourceUriType.PreviousPage:
#pragma warning disable CS8603 // Possible null reference return.
                    return Url.Link(
                        "Transactions",
                        new
                        {
                            pageNumber = resourceParameters.PageNumber - 1,
                            pageSize = resourceParameters.PageSize,
                            accountId = resourceParameters.AccountId
                        }
                    );
                case ResourceUriType.NextPage:
                    return Url.Link(
                        "Transactions",
                        new
                        {
                            pageNumber = resourceParameters.PageNumber + 1,
                            pageSize = resourceParameters.PageSize,
                            accountId = resourceParameters.AccountId
                        }
                    );
                default:
                    return Url.Link(
                        "Transactions",
                        new
                        {
                            pageNumber = resourceParameters.PageNumber,
                            pageSize = resourceParameters.PageSize,
                            accountId = resourceParameters.AccountId
                        }
                    );
#pragma warning restore CS8603 // Possible null reference return.
            }
        }
    }
}
