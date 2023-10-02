using api.Contexts;
using api.Entities;

namespace api.HostedServices
{
    public class UserShareCleanerHostedService : IHostedService
    {
        private readonly ILogger<UploadDirectoryCleanerHostedService> _logger;
        private readonly IServiceScopeFactory _serviceScope;
        private Timer _timer;

        public UserShareCleanerHostedService(
            ILogger<UploadDirectoryCleanerHostedService> logger,
            IServiceScopeFactory serviceScope
        )
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _serviceScope = serviceScope ?? throw new ArgumentNullException(nameof(serviceScope));
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _timer = new Timer(
                StartUploadRepositoryCleanup,
                null,
                0,
                (int)TimeSpan.FromHours(1).TotalMilliseconds
            );
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            if (cancellationToken.IsCancellationRequested)
                _timer.Dispose();
            return Task.CompletedTask;
        }

        private void StartUploadRepositoryCleanup(object? state)
        {
            using (var scope = _serviceScope.CreateScope())
            {
                using (var context = scope.ServiceProvider.GetRequiredService<APIDBContext>())
                {
                    DateOnly deleteTo = DateOnly.FromDateTime(DateTime.Now).AddDays(-30);
                    List<UserShare> userShares = context.UserShares
                        .Where(x => x.SharedOn < deleteTo && string.IsNullOrEmpty(x.SharedWith))
                        .ToList();

                    foreach (UserShare share in userShares)
                    {
                        context.UserShares.Remove(share);
                    }

                    if (userShares.Count > 0)
                        context.SaveChanges();
                }
            }
        }
    }
}
