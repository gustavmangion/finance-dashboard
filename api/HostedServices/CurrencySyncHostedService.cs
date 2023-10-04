using api.Contexts;
using api.Entities;
using api.Helpers;
using Newtonsoft.Json.Linq;
using RestSharp;

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

        private async void StartCurrencySync(object? state)
        {
            using (var scope = _serviceScope.CreateScope())
            {
                using (var context = scope.ServiceProvider.GetRequiredService<APIDBContext>())
                {
                    bool hasRecentRate = context.Currencies
                        .Where(x => x.Date == DateOnly.FromDateTime(DateTime.Now).AddDays(-1))
                        .Any();
                    if (hasRecentRate)
                        return;

                    List<Currency> currencies = await GetCurrencies();
                    context.Currencies.AddRange(currencies);
                    context.SaveChanges();
                }
            }
        }

        private async Task<List<Currency>> GetCurrencies()
        {
            if (
                AppSettingHelper.Currency.APIURL == null || AppSettingHelper.Currency.APIKey == null
            )
                throw new Exception("Currency API key or URL are not setup");

            RestClient client = new RestClient(AppSettingHelper.Currency.APIURL);
            RestRequest request = new RestRequest("live");
            request.AddParameter("access_key", AppSettingHelper.Currency.APIKey);
            request.AddParameter("source", "EUR");

            RestResponse response = await client.GetAsync(request);

            List<Currency> currencies = new List<Currency>();

            if (!response.IsSuccessful)
            {
                _logger.LogError(
                    $"Unable to get currencies: {response.Content} - {response.ErrorMessage}"
                );
                return currencies;
            }

            JObject data = JObject.Parse(response.Content);
            foreach (JToken t in data["quotes"])
            {
                string valueString = t.First().ToString();

                int decimalIndex = valueString.IndexOf(".");
                if (decimalIndex + 6 > valueString.Length)
                    valueString = valueString.Substring(0, valueString.Length);
                else
                    valueString = valueString.Substring(0, decimalIndex + 5);

                currencies.Add(
                    new Currency
                    {
                        Date = DateOnly.FromDateTime(DateTime.Now.AddDays(-1)),
                        Value = decimal.Parse(valueString),
                        From = "EUR",
                        To = t.Path.Substring(10)
                    }
                );
                ;
            }

            return currencies;
        }
    }
}
