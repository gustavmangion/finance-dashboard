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
                (int)TimeSpan.FromHours(6).TotalMilliseconds
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
                    List<Currency> notNeeded = context.Currencies
                        .Where(x => x.Date < DateOnly.FromDateTime(DateTime.Now).AddDays(-31))
                        .ToList();
                    context.Currencies.RemoveRange(notNeeded);
                    context.SaveChanges();

                    for (int i = -1; i > -30; i--)
                    {
                        DateOnly day = DateOnly.FromDateTime(DateTime.Now).AddDays(i);

                        bool hasRate = context.Currencies.Where(x => x.Date == day).Any();
                        if (hasRate)
                            continue;

                        List<Currency> currencies = await GetCurrencies(day);
                        context.Currencies.AddRange(currencies);
                        context.SaveChanges();
                        Thread.Sleep(60000); //to not overcome API rate limit
                    }
                }
            }
        }

        private async Task<List<Currency>> GetCurrencies(DateOnly day)
        {
            if (
                AppSettingHelper.Currency.APIURL == null || AppSettingHelper.Currency.APIKey == null
            )
                throw new Exception("Currency API key or URL are not setup");

            bool mostRecent = DateOnly.FromDateTime(DateTime.Now).AddDays(-1) == day

            RestClient client = new RestClient(AppSettingHelper.Currency.APIURL);
            RestRequest request;
            if (mostRecent)
            {
                request = new RestRequest("live");
            }
            else
            {
                request = new RestRequest("historical");
                request.AddParameter("date", day.ToString("yyyy-MM-dd"));
            }
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
            if (data["quotes"] != null)
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
                            Date = day,
                            Value = decimal.Parse(valueString),
                            From = "EUR",
                            To = t.Path.Substring(10)
                        }
                    );
                    ;
                }

            //check if getting the latest data is from today
            if (mostRecent && currencies.Count > 0 && currencies.First().Date != day)
                currencies = new List<Currency>();

            return currencies;
        }
    }
}
