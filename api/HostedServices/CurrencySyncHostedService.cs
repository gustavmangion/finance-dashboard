using api.Contexts;
using api.Entities;

namespace api.HostedServices
{
    public class CurrencySyncHostedService : IHostedService
    {
        private readonly ILogger<CurrencySyncHostedService> _logger;
        private readonly IServiceScopeFactory _serviceScope;
        private Timer _timer;

        public CurrencySyncHostedService(
            ILogger<CurrencySyncHostedService> logger,
            IServiceScopeFactory serviceScope
        )
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _serviceScope = serviceScope ?? throw new ArgumentNullException(nameof(serviceScope));
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _timer = new Timer(
                StartCurrencySync,
                null,
                0,
                (int)TimeSpan.FromDays(1).TotalMilliseconds
            );
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            if (cancellationToken.IsCancellationRequested)
                _timer.Dispose();
            return Task.CompletedTask;
        }

        private void StartCurrencySync(object? state)
        {
            using (var scope = _serviceScope.CreateScope())
            {
                List<Currency> currencies = new List<Currency>();

                using (var context = scope.ServiceProvider.GetRequiredService<APIDBContext>()) { }
            }
        }
    }
}
