namespace api.Helpers
{
    public class AppSettingHelper
    {
        public static string? APIEnvironment { get; set; }
        public static string? GoogleIAMAudiance { get; set; }

        static AppSettingHelper()
        {
            APIEnvironment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

            if (APIEnvironment == null)
                throw new Exception("Environmental variable is not set");

            var configurationBuilder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{APIEnvironment}.json", optional:true, reloadOnChange:true)
                .AddEnvironmentVariables();

            var config = configurationBuilder.Build();

            GoogleIAMAudiance = config.GetSection("GoogleIAMAudience").Value;
        }
    }
}
