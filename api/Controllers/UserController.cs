﻿using api.Contexts;
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
    public class UserController : BaseController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<UserController> _logger;

        public UserController(
            IUserRepository userRepository,
            IMapper mapper,
            ILogger<UserController> logger
        )
        {
            _userRepository =
                userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [HttpGet]
        public ActionResult GetUser()
        {
            string userId = GetUserIdFromToken();

            User? user = _userRepository.GetUser(userId);

            if (user == null)
                user = new User { Id = "Not Found", SetupNeeded = true };

            UserModel model = _mapper.Map<UserModel>(user);
            if (user.UserPortfolios.Count() == 0)
                model.User.SetupNeeded = true;

            return Ok(model);
        }

        [HttpPost]
        public ActionResult SaveUser(UserModelForCreation model)
        {
            if (string.IsNullOrEmpty(model.PortfolioName))
                ModelState.AddModelError("message", "Portfolio Name is required");

            string userId = GetUserIdFromToken();

            if (_userRepository.UserExists(userId))
                ModelState.AddModelError("message", "User already exists");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            User newUser = new User();
            newUser.Id = GetUserIdFromToken();
            newUser.UserPortfolios.Add(
                new UserPortfolio { Portfolio = new Portfolio { Name = model.PortfolioName }, }
            );

            _userRepository.AddUser(newUser);
            _userRepository.SaveChanges();

            UserModel newUserModel = _mapper.Map<UserModel>(newUser);
            newUserModel.User.SetupNeeded = false;

            return Ok(newUserModel);
        }
    }
}
