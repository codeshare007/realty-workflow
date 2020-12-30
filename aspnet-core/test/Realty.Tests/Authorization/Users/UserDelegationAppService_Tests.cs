using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Runtime.Session;
using Abp.Timing;
using Abp.UI;
using Realty.Authorization.Delegation;
using Realty.Authorization.Users;
using Realty.Authorization.Users.Delegation;
using Realty.Authorization.Users.Delegation.Dto;
using Shouldly;
using Xunit;

namespace Realty.Tests.Authorization.Users
{
    public class UserDelegationAppService_Tests : UserDelegationTestBase
    {
        private readonly IUserDelegationAppService _userDelegationAppService;
        private readonly IUserDelegationConfiguration _userDelegationConfiguration;

        // Existing User Delegations
        // admin -> alex
        // george -> admin

        public UserDelegationAppService_Tests()
        {
            _userDelegationAppService = Resolve<IUserDelegationAppService>();
            _userDelegationConfiguration = Resolve<IUserDelegationConfiguration>();
        }

        [Fact]
        public async Task GetActiveUserDelegations_Tests()
        {
            LoginAsDefaultTenantAdmin();

            var delegations = await _userDelegationAppService.GetActiveUserDelegations();
            delegations.Count.ShouldBe(1);

            LoginAsHostAdmin();
            delegations = await _userDelegationAppService.GetActiveUserDelegations();
            delegations.Count.ShouldBe(0);
        }

        [Fact]
        public async Task DelegateNewUser_Tests()
        {
            if (!_userDelegationConfiguration.IsEnabled)
            {
                return;
            }
            
            LoginAsDefaultTenantAdmin();

            var delegations = await _userDelegationAppService.GetDelegatedUsers(new GetUserDelegationsInput
            {
                MaxResultCount = 10
            });

            delegations.TotalCount.ShouldBe(1);

            var george = UsingDbContext(context => { return context.Users.FirstOrDefault(u => u.UserName == "george"); });
            await _userDelegationAppService.DelegateNewUser(new CreateUserDelegationDto
            {
                TargetUserId = george.Id,
                StartTime = Clock.Now,
                EndTime = Clock.Now.AddDays(7)
            });

            delegations = await _userDelegationAppService.GetDelegatedUsers(new GetUserDelegationsInput
            {
                MaxResultCount = 10
            });

            delegations.TotalCount.ShouldBe(2);
        }

        [Fact]
        public async Task SelfDelegation_Tests()
        {
            if (!_userDelegationConfiguration.IsEnabled)
            {
                return;
            }
            
            LoginAsDefaultTenantAdmin();

            var exception = await Assert.ThrowsAsync<UserFriendlyException>(async () => await _userDelegationAppService.DelegateNewUser(new CreateUserDelegationDto
            {
                TargetUserId = AbpSession.GetUserId(),
                StartTime = Clock.Now,
                EndTime = Clock.Now.AddDays(7)
            }));

            exception.Message.ShouldBe("You can't delegate authorization to yourself !");
        }

        [Fact]
        public async Task RemoveDelegation_Test()
        {
            if (!_userDelegationConfiguration.IsEnabled)
            {
                return;
            }
            
            LoginAsDefaultTenantAdmin();

            var delegations = await _userDelegationAppService.GetDelegatedUsers(new GetUserDelegationsInput
            {
                MaxResultCount = 10
            });

            delegations.TotalCount.ShouldBe(1);

            var delegationId = delegations.Items[0].Id;
            await _userDelegationAppService.RemoveDelegation(new EntityDto<long>(delegationId));

            delegations = await _userDelegationAppService.GetDelegatedUsers(new GetUserDelegationsInput
            {
                MaxResultCount = 10
            });

            delegations.TotalCount.ShouldBe(0);
        }

        [Fact]
        public async Task Remove_Different_Users_Delegation_Test()
        {
            if (!_userDelegationConfiguration.IsEnabled)
            {
                return;
            }
            
            LoginAsDefaultTenantAdmin();

            var differentUsersDelegation = UsingDbContext(context =>
            {
                var george = context.Users.FirstOrDefault(e => e.UserName == "george");
                return context.UserDelegations.FirstOrDefault(e => e.SourceUserId == george.Id);
            });
            
            var exception = await Assert.ThrowsAsync<Exception>(async () => await _userDelegationAppService.RemoveDelegation(new EntityDto<long>(differentUsersDelegation.Id)));
            exception.Message.ShouldBe("Only source user can delete a user delegation !");
        }
    }

    public abstract class UserDelegationTestBase : AppTestBase
    {
        protected UserDelegationTestBase()
        {
            CreateTestUsers();
        }

        protected void CreateTestUsers()
        {
            //Note: There is a default "admin" user also

            UsingDbContext(
                context =>
                {
                    context.Users.Add(CreateUserEntity("alex", "Alex", "Nash", "alex@nash.com"));
                    context.Users.Add(CreateUserEntity("george", "George", "Adams", "george@adams.com"));

                    context.SaveChanges();

                    var george = context.Users.FirstOrDefault(u => u.TenantId == AbpSession.TenantId && u.UserName == "george");
                    var alex = context.Users.FirstOrDefault(u => u.TenantId == AbpSession.TenantId && u.UserName == "alex");
                    var admin = context.Users.FirstOrDefault(u => u.TenantId == AbpSession.TenantId && u.UserName == "admin");

                    context.UserDelegations.Add(new UserDelegation
                    {
                        TenantId = AbpSession.TenantId,
                        SourceUserId = admin.Id,
                        TargetUserId = alex.Id,
                        StartTime = Clock.Now,
                        EndTime = Clock.Now.AddDays(7)
                    });

                    context.UserDelegations.Add(new UserDelegation
                    {
                        TenantId = AbpSession.TenantId,
                        SourceUserId = george.Id,
                        TargetUserId = admin.Id,
                        StartTime = Clock.Now,
                        EndTime = Clock.Now.AddDays(7)
                    });

                    context.SaveChanges();
                });
        }

        protected User CreateUserEntity(string userName, string name, string surname, string emailAddress)
        {
            var user = new User
            {
                EmailAddress = emailAddress,
                IsEmailConfirmed = true,
                Name = name,
                Surname = surname,
                UserName = userName,
                Password = "AM4OLBpptxBYmM79lGOX9egzZk3vIQU3d/gFCJzaBjAPXzYIK3tQ2N7X4fcrHtElTw==", //123qwe
                TenantId = AbpSession.TenantId,
            };

            user.SetNormalizedNames();

            return user;
        }
    }
}
