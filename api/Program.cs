using api.Contexts;
using api.Helpers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NLog;
using NLog.Web;

var logger = LogManager
    .Setup()
    .LoadConfigurationFromFile($"{Directory.GetCurrentDirectory()}/nlog.config")
    .GetCurrentClassLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    // Add services to the container.
    builder.Services.AddControllers().AddNewtonsoftJson();

    builder.Logging.ClearProviders();
    builder.Host.UseNLog();

    builder.Services
        .AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.SaveToken = true;
            options.Authority = "https://accounts.google.com";
            options.Audience = AppSettingHelper.GoogleIAMAudiance;
            options.RequireHttpsMetadata = false;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidIssuer = "accounts.google.com"
            };
        });

    builder.Services.AddAuthorization();

    builder.Services.AddDbContext<APIDBContext>(
        options =>
            options.UseMySql(
                AppSettingHelper.APIDBConnectionString,
                ServerVersion.AutoDetect(AppSettingHelper.APIDBConnectionString)
            )
    );

    // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();

    var app = builder.Build();

    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
        app.UseHttpsRedirection();
    }

    app.UseCors(options => options.AllowAnyOrigin().AllowAnyHeader());

    app.UseForwardedHeaders(
        new ForwardedHeadersOptions
        {
            ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
        }
    );

    app.UseAuthentication();

    app.UseAuthorization();

    app.MapControllers();

    app.Run();
}
catch (Exception e)
{
    logger.Error(e);
    throw;
}
finally
{
    NLog.LogManager.Shutdown();
}
