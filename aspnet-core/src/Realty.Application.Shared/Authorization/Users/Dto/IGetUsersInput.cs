using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Abp.Runtime.Validation;

namespace Realty.Authorization.Users.Dto
{
    public interface IGetUsersInput : ISortedResultRequest
    {
        string Filter { get; set; }

        List<string> Permissions { get; set; }

        int[] Roles { get; set; }

        bool OnlyLockedUsers { get; set; }

        string RoleName { get; set; }
    }
}