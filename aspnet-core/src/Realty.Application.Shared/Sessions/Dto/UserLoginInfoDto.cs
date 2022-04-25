using Abp.Application.Services.Dto;
using System;

namespace Realty.Sessions.Dto
{
    public class UserLoginInfoDto : EntityDto<long>
    {
        public string Name { get; set; }

        public string Surname { get; set; }

        public string UserName { get; set; }

        public string EmailAddress { get; set; }

        public string ProfilePictureId { get; set; }
        
        public Guid PublicId { get; set; }
    }
}
