using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Dependency;
using Abp.Domain.Uow;
using AutoMapper;
using GraphQL.Resolvers;
using GraphQL.Types;
using Microsoft.EntityFrameworkCore;

namespace Realty.Core.Base
{
    public abstract class RealtyQueryBase<TField,TResult> : ITransientDependency
    {
        public IPermissionChecker PermissionChecker { protected get; set; }

        public Dictionary<string, Type> Arguments { get; set; }

        public string FieldName { get; set; }

        public ResolveFieldContext<object> Context { get; set; }

        public IMapper Mapper { protected get; set; }

        protected RealtyQueryBase(string fieldName,
            Dictionary<string, Type> arguments = null)
        {
            PermissionChecker = NullPermissionChecker.Instance;
            FieldName = fieldName;
            Arguments = arguments ?? new Dictionary<string, Type>();
        }

        public List<QueryArgument> GetQueryArguments()
        {
            return Arguments.Select(arg => new QueryArgument(arg.Value)
            {
                Name = arg.Key
            }).ToList();
        }

        [UnitOfWork]
        protected virtual async Task<TResult> InternalResolve(ResolveFieldContext<object> context)
        {
            //you can add your custom logic here before the original Resolve method.
            return await Resolve(context);
        }

        protected abstract Task<TResult> Resolve(ResolveFieldContext<object> context);

        public FieldType GetFieldType()
        {
            return new FieldType
            {
                Name = FieldName,
                Type = typeof(TField),
                Resolver = new FuncFieldResolver<Task<TResult>>(InternalResolve),
                Arguments = new QueryArguments(GetQueryArguments())
            };
        }

        public IQueryable<TDestination> ProjectTo<TDestination>(IQueryable source)
        {
            return Mapper
                .ProjectTo<TDestination>(source, Mapper.ConfigurationProvider);
        }

        public async Task<List<TDestination>> ProjectToListAsync<TDestination>(IQueryable source)
        {
            return await ProjectTo<TDestination>(source)
                .ToListAsync();
        }
    }
}