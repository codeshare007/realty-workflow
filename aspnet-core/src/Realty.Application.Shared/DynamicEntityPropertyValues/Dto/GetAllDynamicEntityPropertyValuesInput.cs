using System.ComponentModel.DataAnnotations;

namespace Realty.DynamicEntityPropertyValues.Dto
{
    public class GetAllDynamicEntityPropertyValuesInput
    {
        [Required]
        public string EntityFullName { get; set; }

        [Required]
        public string EntityId { get; set; }
    }
}
