using System;
using System.IO;
using System.Text;
using Abp.AspNetCore;
using Abp.AspNetCore.Configuration;
using Abp.AspNetCore.SignalR;
using Abp.AspNetZeroCore.Licensing;
using Abp.AspNetZeroCore.Web;
using Abp.Configuration.Startup;
using Abp.Dependency;
using Abp.Hangfire;
using Abp.Hangfire.Configuration;
using Abp.IO;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Abp.Runtime.Caching.Redis;
using Abp.Timing;
using Abp.Zero.Configuration;
using Castle.Core.Internal;
using Castle.MicroKernel.Registration;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.ApplicationParts;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Realty.AmazonS3;
using Realty.AmazonS3.Configuration;
using Realty.Chat;
using Realty.Configuration;
using Realty.Debugging;
using Realty.EntityFrameworkCore;
using Realty.Startup;
using Realty.Storage;
using Realty.Web.Authentication.JwtBearer;
using Realty.Web.Authentication.TwoFactor;
using Realty.Web.Chat.SignalR;
using Realty.Web.Configuration;
using Realty.Web.DashboardCustomization;

namespace Realty.Web
{
    [DependsOn(
        typeof(RealtyApplicationModule),
        typeof(RealtyEntityFrameworkCoreModule),
        typeof(AbpAspNetZeroCoreWebModule),
        typeof(AbpAspNetCoreSignalRModule),
        typeof(RealtyGraphQLModule),
        typeof(AbpRedisCacheModule), //AbpRedisCacheModule dependency (and Abp.RedisCache nuget package) can be removed if not using Redis cache
        typeof(AbpHangfireAspNetCoreModule), //AbpHangfireModule dependency (and Abp.Hangfire.AspNetCore nuget package) can be removed if not using Hangfire
        typeof(RealtyAmazonS3Module)
    )]
    public class RealtyWebCoreModule : AbpModule
    {
        private readonly IWebHostEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public RealtyWebCoreModule(IWebHostEnvironment env)
        {
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public override void PreInitialize()
        {
            //Set default connection string
            Configuration.DefaultNameOrConnectionString = _appConfiguration.GetConnectionString(
                RealtyConsts.ConnectionStringName
            );

            //Use database for language management
            Configuration.Modules.Zero().LanguageManagement.EnableDbLocalization();

            Configuration.Modules.AbpAspNetCore()
                .CreateControllersForAppServices(
                    typeof(RealtyApplicationModule).GetAssembly()
                );

            Configuration.Caching.Configure(TwoFactorCodeCacheItem.CacheName, cache =>
            {
                cache.DefaultAbsoluteExpireTime = TimeSpan.FromMinutes(2);
            });

            if (_appConfiguration["Authentication:JwtBearer:IsEnabled"] != null && bool.Parse(_appConfiguration["Authentication:JwtBearer:IsEnabled"]))
            {
                ConfigureTokenAuth();
            }

            Configuration.ReplaceService<IAppConfigurationAccessor, AppConfigurationAccessor>();

            Configuration.ReplaceService<IAppConfigurationWriter, AppConfigurationWriter>();

            //Uncomment this line to use Hangfire instead of default background job manager (remember also to uncomment related lines in Startup.cs file(s)).
            //Configuration.BackgroundJobs.UseHangfire();

            //Uncomment this line to use Redis cache instead of in-memory cache.
            //See app.config for Redis configuration and connection string
            //Configuration.Caching.UseRedis(options =>
            //{
            //    options.ConnectionString = _appConfiguration["Abp:RedisCache:ConnectionString"];
            //    options.DatabaseId = _appConfiguration.GetValue<int>("Abp:RedisCache:DatabaseId");
            //});
            
            Clock.Provider = ClockProviders.Utc;

            ConfigureAmazonS3Client();
        }

        private void ConfigureTokenAuth()
        {
            IocManager.Register<TokenAuthConfiguration>();
            var tokenAuthConfig = IocManager.Resolve<TokenAuthConfiguration>();

            tokenAuthConfig.SecurityKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_appConfiguration["Authentication:JwtBearer:SecurityKey"]));
            tokenAuthConfig.Issuer = _appConfiguration["Authentication:JwtBearer:Issuer"];
            tokenAuthConfig.Audience = _appConfiguration["Authentication:JwtBearer:Audience"];
            tokenAuthConfig.SigningCredentials = new SigningCredentials(tokenAuthConfig.SecurityKey, SecurityAlgorithms.HmacSha256);
            tokenAuthConfig.AccessTokenExpiration = AppConsts.AccessTokenExpiration;
            tokenAuthConfig.RefreshTokenExpiration = AppConsts.RefreshTokenExpiration;
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(RealtyWebCoreModule).GetAssembly());
        }

        public override void PostInitialize()
        {
            SetAppFolders();

            Configuration.IocManager.IocContainer.Register(
                Component.For<IExternalStorageHandler>()
                    .ImplementedBy<LocalFileStorageHandler>()
                    .LifestyleTransient()
            );

            //if (DebugHelper.IsProduction)
            //{
            //    IocManager.IocContainer.Register(
            //        Component.For<IExternalStorageHandler>()
            //            .ImplementedBy<AmazonS3StorageHandler>()
            //            .Named("AmazonS3StorageHandler")
            //            .IsDefault()
            //            .LifestyleTransient()
            //    );
            //}

            IocManager.Resolve<ApplicationPartManager>()
                .AddApplicationPartsIfNotAddedBefore(typeof(RealtyWebCoreModule).Assembly);
        }

        private void SetAppFolders()
        {
            var appFolders = IocManager.Resolve<AppFolders>();

            appFolders.SampleProfileImagesFolder = Path.Combine(_env.WebRootPath, $"Common{Path.DirectorySeparatorChar}Images{Path.DirectorySeparatorChar}SampleProfilePics");
            appFolders.WebLogsFolder = Path.Combine(_env.ContentRootPath, $"App_Data{Path.DirectorySeparatorChar}Logs");
            appFolders.LocalDocumentsFolder = Path.Combine(_env.ContentRootPath, $"App_Data{Path.DirectorySeparatorChar}Documents");
        }

        private void ConfigureAmazonS3Client() =>
            Configuration.Modules.AmazonS3Client().Init(
                GetConfigurationByKey(AppSettings.AmazonS3Storage.BucketName),
                GetConfigurationByKey(AppSettings.AmazonS3Storage.Region),
                GetConfigurationByKey(AppSettings.AmazonS3Storage.ProfileName)
            );

        private string GetConfigurationByKey(string name) => _appConfiguration.GetFromSettings(name);
    }
}
