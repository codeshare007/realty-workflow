using Abp.Application.Services.Dto;

namespace Realty.Authorization.Users.Dto
{
    public class UserShortInfoDto : EntityDto<long>
    {
        public string FullName { get; set; }
    }
}