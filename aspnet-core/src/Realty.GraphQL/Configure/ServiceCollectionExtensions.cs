using GraphQL;
using GraphQL.Server;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.DependencyInjection;
using Realty.Debugging;

namespace Realty.Configure
{
    public static class ServiceCollectionExtensions
    {
        public static void AddAndConfigureGraphQL(this IServiceCollection services)
        {
            services.AddScoped<IDependencyResolver>(
                x => new FuncDependencyResolver(x.GetRequiredService)
            );

            services
                .AddGraphQL(x => { x.ExposeExceptions = DebugHelper.IsDebug; })
                .AddGraphTypes(ServiceLifetime.Scoped)
                .AddUserContextBuilder(httpContext => httpContext.User)
                .AddDataLoader();

            AllowSynchronousIo(services);
        }

        //https://github.com/graphql-dotnet/graphql-dotnet/issues/1326
        private static void AllowSynchronousIo(IServiceCollection services)
        {
            // kestrel
            services.Configure<KestrelServerOptions>(options => { options.AllowSynchronousIO = true; });

            // IIS
            services.Configure<IISServerOptions>(options => { options.AllowSynchronousIO = true; });
        }
    }
}