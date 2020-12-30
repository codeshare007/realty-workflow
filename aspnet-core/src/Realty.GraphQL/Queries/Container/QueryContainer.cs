using Abp.Dependency;
using GraphQL.Types;

namespace Realty.Queries.Container
{
    public sealed class QueryContainer : ObjectGraphType, ITransientDependency
    {
        public QueryContainer(RoleQuery roleQuery, UserQuery userQuery, OrganizationUnitQuery organizationUnitQuery)
        {
            AddField(roleQuery.GetFieldType());

            AddField(organizationUnitQuery.GetFieldType());

            AddField(userQuery.GetFieldType());
        }
    }
}