using Realty.Dto;

namespace Realty.Common.Dto
{
    public class FindUsersInput : PagedAndFilteredInputDto
    {
        public int? TenantId { get; set; }

        public bool ExcludeCurrentUser { get; set; }

        public string UserRole { get; set; }
    }
}