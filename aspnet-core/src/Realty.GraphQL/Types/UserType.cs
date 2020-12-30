using GraphQL.Types;
using Realty.Dto;

namespace Realty.Types
{
    public class UserType : ObjectGraphType<UserDto>
    {
        public static class ChildFields
        {
            public const string Items = "items";
            public const string Roles = "roles";
            public const string OrganizationUnits = "organizationUnits";

            public static string GetFieldSelector(string childField)
            {
                return string.Concat(Items, ":", childField);
            }
        }

        public UserType()
        {
            Field(x => x.Id);
            Field(x => x.Name);
            Field(x => x.Surname);
            Field(x => x.UserName);
            Field(x => x.EmailAddress);
            Field(x => x.PhoneNumber);
            Field(x => x.IsActive);
            Field(x => x.IsEmailConfirmed);
            Field(x => x.CreationTime);
            Field(x => x.TenantId, nullable: true);
            Field(x => x.ProfilePictureId, nullable: true, type: typeof(StringGraphType));

            Field<ListGraphType<RoleType>>(ChildFields.Roles);
            Field<ListGraphType<OrganizationUnitType>>(ChildFields.OrganizationUnits);
        }

        public class RoleType : ObjectGraphType<UserDto.RoleDto>
        {
            public RoleType()
            {
                Field(x => x.Id);
                Field(x => x.Name);
                Field(x => x.DisplayName);
            }
        }

        public class OrganizationUnitType : ObjectGraphType<UserDto.OrganizationUnitDto>
        {
            public OrganizationUnitType()
            {
                Field(x => x.Id);
                Field(x => x.Code);
                Field(x => x.DisplayName);
            }
        }
    }
}
