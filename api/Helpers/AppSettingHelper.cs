using api.Entities;

namespace api.Helpers
{
    public class AppSettingHelper
    {
        public static string? APIEnvironment { get; set; }
        public static string? GoogleIAMAudiance { get; set; }
        public static string APIDBConnectionString { get; set; }
        public static string StatementCodeKey { get; set; }
        public static int DrillDownMaxRecords = 30;

        public static class Currency
        {
            public static string? APIURL { get; set; }
            public static string? APIKey { get; set; }
        }

        static AppSettingHelper()
        {
            APIEnvironment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            APIDBConnectionString = Environment.GetEnvironmentVariable("APIDBConn") ?? "";
            StatementCodeKey = Environment.GetEnvironmentVariable("StatementCodeKey") ?? "";

            if (APIEnvironment == null)
                throw new Exception("Environmental variable is not set - ASPNETCORE_ENVIRONMENT");

            if (string.IsNullOrEmpty(APIDBConnectionString))
                throw new Exception("Environmental variable is not set - APIDBConn");

            if (string.IsNullOrEmpty(StatementCodeKey))
                throw new Exception("Environmental variable is not set - StatementCodeKey");

            var configurationBuilder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile(
                    $"appsettings.{APIEnvironment}.json",
                    optional: true,
                    reloadOnChange: true
                )
                .AddEnvironmentVariables();

            var config = configurationBuilder.Build();

            GoogleIAMAudiance = config.GetSection("GoogleIAMAudience").Value;

            Currency.APIURL = config.GetSection("Currency").GetSection("APIURL").Value;
            Currency.APIKey = config.GetSection("Currency").GetSection("APIKey").Value;
        }

        public static string GetStatementFileDirectory(Guid id)
        {
            return Path.Combine(
                Directory.GetCurrentDirectory(),
                "WorkingDirectory",
                "StatementUploads",
                $"{id}.pdf"
            );
        }
    }
}
