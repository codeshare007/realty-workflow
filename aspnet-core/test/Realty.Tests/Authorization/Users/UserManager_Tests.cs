using System.Linq;
using System.Threading.Tasks;
using Abp.Configuration;
using Abp.Zero.Configuration;
using Realty.Authorization.Users;
using Shouldly;
using Xunit;

namespace Realty.Tests.Authorization.Users
{
    public class UserManager_Tests : UserAppServiceTestBase
    {
        private readonly ISettingManager _settingManager;
        private readonly UserManager _userManager;

        public UserManager_Tests()
        {
            _settingManager = Resolve<ISettingManager>();
            _userManager = Resolve<UserManager>();

            LoginAsDefaultTenantAdmin();
        }

        [Fact]
        public async Task Should_Create_User_With_Random_Password_For_Tenant()
        {
            await _settingManager.ChangeSettingForApplicationAsync(AbpZeroSettingNames.UserManagement.PasswordComplexity.RequireUppercase, "true");
            await _settingManager.ChangeSettingForApplicationAsync(AbpZeroSettingNames.UserManagement.PasswordComplexity.RequireNonAlphanumeric, "true");
            await _settingManager.ChangeSettingForApplicationAsync(AbpZeroSettingNames.UserManagement.PasswordComplexity.RequiredLength, "25");

            var randomPassword = await _userManager.CreateRandomPassword();

            randomPassword.Length.ShouldBeGreaterThanOrEqualTo(25);
            randomPassword.Any(char.IsUpper).ShouldBeTrue();
            randomPassword.Any(char.IsLetterOrDigit).ShouldBeTrue();
        }
    }
}
