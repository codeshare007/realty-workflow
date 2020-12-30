using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.DynamicEntityProperties;
using Microsoft.AspNetCore.Authorization;
using Realty.Authorization;
using Realty.DynamicEntityProperties.Dto;

namespace Realty.DynamicEntityProperties
{
    [Authorize(AppPermissions.Pages_Administration_DynamicPropertyValue)]
    public class DynamicPropertyValueAppService : RealtyAppServiceBase, IDynamicPropertyValueAppService
    {
        private readonly IDynamicPropertyValueManager _dynamicPropertyValueManager;
        private readonly IDynamicPropertyValueStore _dynamicPropertyValueStore;

        public DynamicPropertyValueAppService(
            IDynamicPropertyValueManager dynamicPropertyValueManager,
            IDynamicPropertyValueStore dynamicPropertyValueStore
        )
        {
            _dynamicPropertyValueManager = dynamicPropertyValueManager;
            _dynamicPropertyValueStore = dynamicPropertyValueStore;
        }

        public async Task<DynamicPropertyValueDto> Get(int id)
        {
            var entity = await _dynamicPropertyValueManager.GetAsync(id);
            return ObjectMapper.Map<DynamicPropertyValueDto>(entity);
        }

        public async Task<ListResultDto<DynamicPropertyValueDto>> GetAllValuesOfDynamicProperty(EntityDto input)
        {
            var entities = await _dynamicPropertyValueStore.GetAllValuesOfDynamicPropertyAsync(input.Id);
            return new ListResultDto<DynamicPropertyValueDto>(
                ObjectMapper.Map<List<DynamicPropertyValueDto>>(entities)
            );
        }

        [Authorize(AppPermissions.Pages_Administration_DynamicPropertyValue_Create)]
        public async Task Add(DynamicPropertyValueDto dto)
        {
            dto.TenantId = AbpSession.TenantId;
            await _dynamicPropertyValueManager.AddAsync(ObjectMapper.Map<DynamicPropertyValue>(dto));
        }

        [Authorize(AppPermissions.Pages_Administration_DynamicPropertyValue_Edit)]
        public async Task Update(DynamicPropertyValueDto dto)
        {
            dto.TenantId = AbpSession.TenantId;
            await _dynamicPropertyValueManager.UpdateAsync(ObjectMapper.Map<DynamicPropertyValue>(dto));
        }

        [Authorize(AppPermissions.Pages_Administration_DynamicPropertyValue_Delete)]
        public async Task Delete(int id)
        {
            await _dynamicPropertyValueManager.DeleteAsync(id);
        }
    }
}