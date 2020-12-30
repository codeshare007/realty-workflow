using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.Localization;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using Realty.Editions;
using Realty.Editions.Dto;
using Realty.Features;
using Shouldly;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace Realty.Tests.Editions
{
    // ReSharper disable once InconsistentNaming
    public class EditionAppService_Tests : AppTestBase
    {
        private readonly IEditionAppService _editionAppService;
        private readonly IRepository<SubscribableEdition> _subcribableEditionRepository;
        private readonly ILocalizationManager _localizationManager;

        public EditionAppService_Tests()
        {
            LoginAsHostAdmin();

            _editionAppService = Resolve<IEditionAppService>();
            _subcribableEditionRepository = Resolve<IRepository<SubscribableEdition>>();
            _localizationManager = Resolve<ILocalizationManager>();
        }

        [MultiTenantFact]
        public async Task Should_Get_Editions()
        {
            var editions = await _editionAppService.GetEditions();
            editions.Items.Count.ShouldBeGreaterThan(0);
        }

        [MultiTenantFact]
        public async Task Should_Create_Edition()
        {
            //Getting edition for edit
            var output = await _editionAppService.GetEditionForEdit(new NullableIdDto(null));

            //Changing a sample feature value
            var chatFeature = output.FeatureValues.FirstOrDefault(f => f.Name == AppFeatures.ChatFeature);
            if (chatFeature != null)
            {
                chatFeature.Value = chatFeature.Value = "true";
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

            await UsingDbContextAsync(async context =>
            {
                var premiumEditon = await context.Editions.FirstOrDefaultAsync(e => e.DisplayName == "Premium Edition");
                premiumEditon.ShouldNotBeNull();

                if (chatFeature != null)
                {
                    var sampleFeatureValue = context.EditionFeatureSettings.FirstOrDefault(s => s.EditionId == premiumEditon.Id && s.Name == AppFeatures.ChatFeature);
                    sampleFeatureValue.ShouldNotBe(null);
                    sampleFeatureValue.Value.ShouldBe("true");
                }
            });
        }

        [MultiTenantFact]
        public async Task Should_Create_Subscribable_Edition()
        {
            var editionName = "Premium Edition";
            var monthlyPrice = 10;
            var annualPrice = 100;

            await _editionAppService.CreateEdition(
                new CreateEditionDto
                {
                    Edition = new EditionCreateDto
                    {
                        DisplayName = editionName,
                        MonthlyPrice = monthlyPrice,
                        AnnualPrice = annualPrice,
                    },
                    FeatureValues = new List<NameValueDto>()
                });

            var editionRecord = UsingDbContext(context => context.Editions.FirstOrDefault(e => e.DisplayName == editionName));

            var premiumEditon = await _subcribableEditionRepository.GetAsync(editionRecord.Id);
            premiumEditon.ShouldNotBeNull();

            premiumEditon.MonthlyPrice.ShouldBe(monthlyPrice);
            premiumEditon.AnnualPrice.ShouldBe(annualPrice);
        }

        [MultiTenantFact]
        public async Task Should_Update_Edition()
        {
            var defaultEdition = UsingDbContext(context => context.Editions.FirstOrDefault(e => e.Name == EditionManager.DefaultEditionName));
            defaultEdition.ShouldNotBeNull();

            var output = await _editionAppService.GetEditionForEdit(new NullableIdDto(defaultEdition.Id));

            //Changing a sample feature value
            var chatFeature = output.FeatureValues.FirstOrDefault(f => f.Name == AppFeatures.ChatFeature);
            if (chatFeature != null)
            {
                chatFeature.Value = chatFeature.Value = "true";
            }

            await _editionAppService.UpdateEdition(
                new UpdateEditionDto
                {
                    Edition = new EditionEditDto
                    {
                        Id = output.Edition.Id,
                        DisplayName = "Regular Edition"
                    },
                    FeatureValues = output.FeatureValues
                });

            UsingDbContext(context =>
            {
                defaultEdition = context.Editions.FirstOrDefault(e => e.Name == EditionManager.DefaultEditionName);
                defaultEdition.ShouldNotBe(null);
                defaultEdition?.DisplayName.ShouldBe("Regular Edition");
            });
        }

        [MultiTenantFact]
        public async Task Should_Not_Delete_Edition_If_There_Are_Subscriber_Tenants()
        {
            var editions = await _editionAppService.GetEditions();
            editions.Items.Count.ShouldBeGreaterThan(0);

            var defaultEdition = UsingDbContext(context => context.Editions.FirstOrDefault(e => e.Name == EditionManager.DefaultEditionName));

            var exception = await Assert.ThrowsAsync<UserFriendlyException>(async () => await _editionAppService.DeleteEdition(new EntityDto(defaultEdition.Id)));
            exception.Message.ShouldContain(_localizationManager.GetString(RealtyConsts.LocalizationSourceName, "ThereAreTenantsSubscribedToThisEdition"));
        }
    }
}
