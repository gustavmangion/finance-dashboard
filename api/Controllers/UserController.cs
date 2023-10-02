using api.Contexts;
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
    public class UserController : BaseController
    {
        private readonly IUserRepository _userRepository;
        private readonly IPortfolioRepository _portfolioRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<UserController> _logger;

        public UserController(
            IUserRepository userRepository,
            IPortfolioRepository portfolioRepository,
            IMapper mapper,
            ILogger<UserController> logger
        )
        {
            _userRepository =
                userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _portfolioRepository =
                portfolioRepository ?? throw new ArgumentNullException(nameof(portfolioRepository));
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

            return Ok(_mapper.Map<UserModel>(user));
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

            return Ok(_mapper.Map<UserModel>(newUser));
        }

        [HttpGet("Share")]
        public ActionResult GetUserSharing()
        {
            string userId = GetUserIdFromToken();

            UserShareModel model = new UserShareModel();

            UserShareCode? userShareCode = _userRepository.GetShareCode(userId);

            if (userShareCode != null)
            {
                model.ShareCodeSetup = true;
                model.UserShares = _mapper.Map<List<UserShareModelShares>>(
                    _userRepository.GetShares(userId)
                );
            }

            return Ok(model);
        }

        [HttpPost("Share")]
        public ActionResult AddUserShare([FromBody] UserShareModelForCreation model)
        {
            string userId = GetUserIdFromToken();

            if (string.IsNullOrEmpty(model.Alias))
                ModelState.AddModelError("message", "Alias is required");
            else if (_userRepository.GetShareCode(userId) == null)
                ModelState.AddModelError("message", "User share code is not setup");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (_userRepository.AliasExists(model.Alias, userId))
                return BadRequest("Alias already exists");

            UserShare userShare = new UserShare();
            userShare.UserId = userId;
            userShare.Alias = model.Alias;
            userShare.InviteCode = GenerateInviteCode();

            _userRepository.AddShare(userShare);
            _userRepository.SaveChanges();

            return Ok(_mapper.Map<UserShareModelShares>(userShare));
        }

        [HttpPut("Share")]
        public ActionResult AcceptUserShare([FromBody] UserShareAcceptModel model)
        {
            if (string.IsNullOrEmpty(model.Alias))
            {
                ModelState.AddModelError("message", "Alias is required");
                return BadRequest(ModelState);
            }

            UserShare? userShare = _userRepository.GetUserShare(model.InviteCode);
            UserShareCode? shareCode = null;

            if (userShare != null)
            {
                shareCode = _userRepository.GetShareCode(userShare.UserId);
            }

            string userId = GetUserIdFromToken();

            if (
                userShare == null
                || shareCode == null
                || userShare.UserId == userId
                || EncryptionHelper.DecryptString(shareCode.EncryptedCode) != model.ShareCode
            )
                return BadRequest("Cannot accept invite");

            if (_userRepository.AliasExists(model.Alias, userId))
                return BadRequest("Alias already exists");

            userShare.InviteCode = "";
            userShare.SharedWith = userId;
            userShare.UserPortfolios.ForEach(x => x.UserId = userId);

            UserShare correspondingShare = new UserShare();
            correspondingShare.UserId = userId;
            correspondingShare.SharedWith = userShare.UserId;
            correspondingShare.InviteCode = "";
            correspondingShare.SharedOn = userShare.SharedOn;
            correspondingShare.Alias = model.Alias;

            _userRepository.AddShare(correspondingShare);
            _userRepository.SaveChanges();

            return Ok();
        }

        [HttpDelete("Share/{id}")]
        public ActionResult RevokeOrDeleteUserShare(Guid id)
        {
            UserShare? userShare = _userRepository.GetUserShare(id);
            string userId = GetUserIdFromToken();

            if (userShare == null || userShare.UserId != userId)
            {
                ModelState.AddModelError("message", "Invalid Share Id");
                return BadRequest(ModelState);
            }

            if (userShare.SharedWith != null)
            {
                UserShare? correspondingShare = _userRepository.GetCorrespondingUserShare(
                    userId,
                    userShare.SharedWith
                );
                if (correspondingShare != null)
                {
                    correspondingShare.Revoked = true;
                    correspondingShare.SharedWith = null;
                }
            }

            _userRepository.DeleteShare(userShare);
            _userRepository.SaveChanges();

            return Ok();
        }

        [HttpGet("ShareCode")]
        public ActionResult GetShareCode()
        {
            UserShareCode? shareCode = _userRepository.GetShareCode(GetUserIdFromToken());

            if (shareCode == null)
            {
                ModelState.AddModelError("message", "Share code not set");
                return BadRequest(ModelState);
            }

            return Ok(_mapper.Map<UserShareCodeModel>(shareCode));
        }

        [HttpPost("ShareCode")]
        public ActionResult AddShareCode([FromBody] UserShareCodeForCreation model)
        {
            string userId = GetUserIdFromToken();

            string encryptedCode = EncryptionHelper.EncryptString(model.Code);

            UserShareCode? shareCode = _userRepository.GetShareCode(userId);

            if (shareCode == null)
            {
                shareCode = new UserShareCode();
                shareCode.UserID = userId;
                _userRepository.AddShareCode(shareCode);
            }

            shareCode.EncryptedCode = encryptedCode;

            _userRepository.SaveChanges();

            return Ok();
        }

        private string GenerateInviteCode()
        {
            Random random = new Random();
            int code = random.Next(100000, 999999);

            while (_userRepository.InviteCodeExists(code.ToString()))
            {
                code = random.Next(100000, 999999);
            }

            return code.ToString();
        }
    }
}
