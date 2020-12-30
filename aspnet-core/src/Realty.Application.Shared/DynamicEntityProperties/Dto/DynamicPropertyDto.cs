using Abp.Application.Services.Dto;

namespace Realty.DynamicEntityProperties.Dto
{
    public class DynamicPropertyDto : EntityDto
    {
        public string PropertyName { get; set; }

        public string InputType { get; set; }

        public string Permission { get; set; }

        public int? TenantId { get; set; }
    }
}
