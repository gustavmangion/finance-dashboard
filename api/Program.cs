using api.Contexts;
using api.Helpers;
using api.HostedServices;
using api.Repositories;
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
    builder.Services
        .AddControllers()
        .AddNewtonsoftJson(
            options =>
                options.SerializerSettings.ReferenceLoopHandling = Newtonsoft
                    .Json
                    .ReferenceLoopHandling
                    .Ignore
        );

    builder.Logging.ClearProviders();
    builder.Host.UseNLog();

    builder.Services.AddAutoMapper(typeof(Program));

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
            options
                .UseLazyLoadingProxies()
                .UseMySql(
                    AppSettingHelper.APIDBConnectionString,
                    ServerVersion.AutoDetect(AppSettingHelper.APIDBConnectionString)
                )
    );

    builder.Services.AddScoped<IUserRepository, UserRepository>();
    builder.Services.AddScoped<IAccountRepository, AccountRepository>();
    builder.Services.AddScoped<IPortfolioRepository, PortfolioRepository>();

    builder.Services.AddHostedService<UploadDirectoryCleanerHostedService>();

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

    app.UseCors(options => options.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());

    if (app.Environment.IsProduction())
    {
        app.UseForwardedHeaders(
            new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
            }
        );
    }

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
