using Abp.Dependency;
using GraphQL;
using GraphQL.Types;
using Realty.Queries.Container;

namespace Realty.Schemas
{
    public class MainSchema : Schema, ITransientDependency
    {
        public MainSchema(IDependencyResolver resolver) :
            base(resolver)
        {
            Query = resolver.Resolve<QueryContainer>();
        }
    }
}