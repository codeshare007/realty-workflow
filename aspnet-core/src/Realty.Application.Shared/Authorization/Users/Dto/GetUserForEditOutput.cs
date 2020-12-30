using System;
using System.Collections.Generic;
using Realty.Organizations.Dto;

namespace Realty.Authorization.Users.Dto
{
    public class GetUserForEditOutput
    {
        public Guid? ProfilePictureId { get; set; }

        public UserEditDto User { get; set; }
    }
}