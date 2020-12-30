using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using Abp.Organizations;
using Realty.Authorization.Roles;

namespace Realty.Dto
{
    /*Mapped in CustomDtoMapper.cs*/
    public class UserDto : EntityDto<long>, IPassivable, IHasCreationTime
    {
        public string Name { get; set; }

        public string Surname { get; set; }

        public string UserName { get; set; }

        public string EmailAddress { get; set; }

        public string PhoneNumber { get; set; }

        public Guid? ProfilePictureId { get; set; }

        public bool IsEmailConfirmed { get; set; }

        public bool IsActive { get; set; }

        public DateTime CreationTime { get; set; }

        public int? TenantId { get; set; }

        public IEnumerable<RoleDto> Roles { get; set; }

        public IEnumerable<OrganizationUnitDto> OrganizationUnits { get; set; }

        public UserDto()
        {
            Roles = new List<RoleDto>();
            OrganizationUnits = new List<OrganizationUnitDto>();
        }


        [AutoMapFrom(typeof(Role))]
        public class RoleDto
        {
            public int Id { get; set; }

            public string Name { get; set; }

            public string DisplayName { get; set; }
        }

        [AutoMapFrom(typeof(OrganizationUnit))]
        public class OrganizationUnitDto
        {
            public long Id { get; set; }

            public string Code { get; set; }

            public string DisplayName { get; set; }
        }
    }
}