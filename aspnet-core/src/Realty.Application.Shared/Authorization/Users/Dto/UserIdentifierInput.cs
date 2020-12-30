using System;
using System.Collections.Generic;
using Realty.Organizations.Dto;

namespace Realty.Authorization.Users.Dto
{
    public class UserIdentifierInput
    {
        public long? Id { get; set; }
        public Guid PublicId { get; set; }
        public string RoleName { get; set; }
    }
}