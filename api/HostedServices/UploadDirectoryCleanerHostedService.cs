using api.Contexts;
using api.Entities;
using Microsoft.OpenApi.Writers;

namespace api.HostedServices
{
    public class UploadDirectoryCleanerHostedService : IHostedService
    {
        private readonly ILogger<UploadDirectoryCleanerHostedService> _logger;
        private readonly IServiceScopeFactory _serviceScope;
        private Timer _timer;

        public UploadDirectoryCleanerHostedService(
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
                    DateTime deleteTo = DateTime.UtcNow.AddHours(-1);
                    List<Statement> pendingStatements = context.Statements
                        .Where(x => x.Account == null && x.UploadedAt < deleteTo)
                        .ToList();

                    foreach (Statement statement in pendingStatements)
                    {
                        string path = Path.Combine(
                            Directory.GetCurrentDirectory(),
                            "WorkingDirectory",
                            "StatementUploads",
                            $"{statement.Id}.pdf"
                        );
                        try
                        {
                            File.Delete(path);
                            context.Statements.Remove(statement);
                        }
                        catch (Exception e)
                        {
                            _logger.LogError($"Unable to delete statement file {statement}");
                        }
                    }

                    if (pendingStatements.Count > 0)
                        context.SaveChanges();
                }
            }
        }
    }
}
