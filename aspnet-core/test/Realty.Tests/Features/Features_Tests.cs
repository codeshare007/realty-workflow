﻿using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Localization;
using Abp.MultiTenancy;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using Realty.Authorization.Users;
using Realty.Authorization.Users.Dto;
using Realty.Editions;
using Realty.Editions.Dto;
using Realty.Features;
using Realty.Test.Base;
using Shouldly;
using Xunit;

namespace Realty.Tests.Features
{
    // ReSharper disable once InconsistentNaming
    public class Features_Tests : AppTestBase
    {
        private readonly IEditionAppService _editionAppService;
        private readonly IUserAppService _userAppService;
        private readonly ILocalizationManager _localizationManager;

        public Features_Tests()
        {
            LoginAsHostAdmin();
            _editionAppService = Resolve<IEditionAppService>();
            _userAppService = Resolve<IUserAppService>();
            _localizationManager = Resolve<ILocalizationManager>();
        }

        [MultiTenantFact]
        public async Task Should_Not_Create_User_More_Than_Allowed_Count()
        {
            //Getting edition for edit
            var output = await _editionAppService.GetEditionForEdit(new NullableIdDto(null));

            //Changing a sample feature value
            var maxUserCountFeature = output.FeatureValues.FirstOrDefault(f => f.Name == AppFeatures.MaxUserCount);
            if (maxUserCountFeature != null)
            {
                maxUserCountFeature.Value = "2";
            }

            await _editionAppService.CreateEdition(
                new CreateEditionDto
                {
                    Edition = new EditionCreateDto
                    {
                        DisplayName = "Premium Edition"
                    },
                    FeatureValues = output.FeatureValues
                });


            var premiumEditon = (await _editionAppService.GetEditions()).Items.FirstOrDefault(e => e.DisplayName == "Premium Edition");
            premiumEditon.ShouldNotBeNull();

            await UsingDbContextAsync(async context =>
            {
                var tenant = await context.Tenants.SingleAsync(t => t.TenancyName == AbpTenantBase.DefaultTenantName);
                tenant.EditionId = premiumEditon.Id;

                context.SaveChanges();
            });

            LoginAsDefaultTenantAdmin();

            // This is second user (first is tenant admin)
            await _userAppService.CreateOrUpdateUser(
                new CreateOrUpdateUserInput
                {
                    User = new UserEditDto
                    {
                        EmailAddress = "test@mail.com",
                        Name = "John",
                        Surname = "Nash",
                        UserName = "johnnash",
                        Password = "123qwE*"
                    },
                    AssignedRoleNames = new string[] { }
                });

            //Act
            var exception = await Assert.ThrowsAsync<UserFriendlyException>(
                async () =>
                    await _userAppService.CreateOrUpdateUser(
                        new CreateOrUpdateUserInput
                        {
                            User = new UserEditDto
                            {
                                EmailAddress = "test2@mail.com",
                                Name = "Ali Rıza",
                                Surname = "Adıyahşi",
                                UserName = "alirizaadiyahsi",
                                Password = "123qwE*"
                            },
                            AssignedRoleNames = new string[] { }
                        })
            );

            exception.Message.ShouldContain(_localizationManager.GetString(RealtyConsts.LocalizationSourceName, "MaximumUserCount_Error_Message"));
        }
    }
}
