using System;
using Abp.Application.Services.Dto;

namespace Realty.Authorization.Users.Dto
{
    public class UserSearchDto
    {
        public string Name { get; set; }
        public Guid PublicId { get; set; }
    }
}