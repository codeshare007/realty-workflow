using System.Linq;
using System.Threading.Tasks;
using Abp.MultiTenancy;
using Realty.Authorization.Accounts;
using Realty.Authorization.Accounts.Dto;
using Realty.Test.Base;
using Shouldly;
using Xunit;

namespace Realty.Tests.Authorization.Accounts
{
    // ReSharper disable once InconsistentNaming
    public class AccountAppService_Tests : AppTestBase
    {
        private readonly IAccountAppService _accountAppService;

        public AccountAppService_Tests()
        {
            _accountAppService = Resolve<IAccountAppService>();
        }

        [Fact]
        public async Task Should_Check_If_Given_Tenant_Is_Available()
        {
            //Act
            var output = await _accountAppService.IsTenantAvailable(
                new IsTenantAvailableInput
                {
                    TenancyName = AbpTenantBase.DefaultTenantName
                }
            );

            //Assert
            output.State.ShouldBe(TenantAvailabilityState.Available);
            output.TenantId.ShouldNotBeNull();
        }

        [Fact]
        public async Task Should_Return_NotFound_If_Tenant_Is_Not_Defined()
        {
            //Act
            var output = await _accountAppService.IsTenantAvailable(
                new IsTenantAvailableInput
                {
                    TenancyName = "UnknownTenant"
                }
            );

            //Assert
            output.State.ShouldBe(TenantAvailabilityState.NotFound);
        }

        [Fact]
        public async Task Should_Register()
        {
            //Act
            await _accountAppService.Register(new RegisterInput
            {
                UserName = "john",
                Password = "john123",
                Name = "John",
                Surname = "Nash",
                EmailAddress = "john.nash@aspnetzero.com"
            });

            //Assert
            UsingDbContext(context =>
            {
                context.Users.FirstOrDefault(
                    u => u.TenantId == AbpSession.TenantId &&
                         u.EmailAddress == "john.nash@aspnetzero.com"
                ).ShouldNotBeNull();
            });
        }
    }
}
