using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Runtime.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Logging;
using Microsoft.IdentityModel.Tokens;
using Realty.Configuration;
using Realty.Web.Authentication.JwtBearer;

namespace Realty.Web.Startup
{
    public static class AuthConfigurer
    {
        public static void Configure(IServiceCollection services, IConfiguration configuration)
        {
            var authenticationBuilder = services.AddAuthentication();
            
            if (bool.Parse(configuration["Authentication:JwtBearer:IsEnabled"]))
            {
                authenticationBuilder.AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        // The signing key must match!
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(configuration["Authentication:JwtBearer:SecurityKey"])),

                        // Validate the JWT Issuer (iss) claim
                        ValidateIssuer = true,
                        ValidIssuer = configuration["Authentication:JwtBearer:Issuer"],

                        // Validate the JWT Audience (aud) claim
                        ValidateAudience = true,
                        ValidAudience = configuration["Authentication:JwtBearer:Audience"],

                        // Validate the token expiry
                        ValidateLifetime = true,

                        // If you want to allow a certain amount of clock drift, set that here
                        ClockSkew = TimeSpan.Zero
                    };

                    options.SecurityTokenValidators.Clear();
                    options.SecurityTokenValidators.Add(new RealtyJwtSecurityTokenHandler());

                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = QueryStringTokenResolver
                    };
                });
            }

            if (bool.Parse(configuration["IdentityServer:IsEnabled"]))
            {
                IdentityModelEventSource.ShowPII = true;
                authenticationBuilder.AddIdentityServerAuthentication("IdentityBearer", options =>
                {
                    options.Authority = configuration["IdentityServer:Authority"];
                    options.ApiName = configuration["IdentityServer:ApiName"];
                    options.ApiSecret = configuration["IdentityServer:ApiSecret"];
                    options.RequireHttpsMetadata = false;
                });
            }
        }

        /* This method is needed to authorize SignalR javascript client.
         * SignalR can not send authorization header. So, we are getting it from query string as an encrypted text. */
        private static Task QueryStringTokenResolver(MessageReceivedContext context)
        {
            if (!context.HttpContext.Request.Path.HasValue)
            {
                return Task.CompletedTask;
            }

            if (context.HttpContext.Request.Path.Value.StartsWith("/signalr"))
            {
                var env = context.HttpContext.RequestServices.GetService<IWebHostEnvironment>();
                var config = env.GetAppConfiguration();
                var allowAnonymousSignalRConnection = bool.Parse(config["App:AllowAnonymousSignalRConnection"]);

                return SetToken(context, allowAnonymousSignalRConnection);
            }

            List<string> urlsUsingEnchAuthToken = new List<string>()
            {
                "/Chat/GetUploadedObject?",
                "/Profile/GetProfilePictureByUser?"
            };

            if (urlsUsingEnchAuthToken.Any(url => context.HttpContext.Request.GetDisplayUrl().Contains(url)))
            {
                if (context.HttpContext.Request.Headers.ContainsKey("authorization"))
                {
                    return Task.CompletedTask;
                }
                    
                return SetToken(context, false);  
            }
            
            return Task.CompletedTask;
        }

        private static Task SetToken(MessageReceivedContext context, bool allowAnonymous)
        {
            var qsAuthToken = context.HttpContext.Request.Query["enc_auth_token"].FirstOrDefault();
            if (qsAuthToken == null)
            {
                if (!allowAnonymous)
                {
                    throw new AbpAuthorizationException("SignalR auth token is missing.");
                }

                return Task.CompletedTask;
            }

            //Set auth token from cookie
            context.Token = SimpleStringCipher.Instance.Decrypt(qsAuthToken, AppConsts.DefaultPassPhrase);
            return Task.CompletedTask;
        }
    }
}
