using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Authorization.Users;
using Abp.Collections.Extensions;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Abp.Organizations;
using GraphQL.Types;
using Microsoft.EntityFrameworkCore;
using Realty.Authorization;
using Realty.Authorization.Roles;
using Realty.Authorization.Users;
using Realty.Core.Base;
using Realty.Dto;
using Realty.Types;
using Realty.Core.Extensions;

namespace Realty.Queries
{
    public class UserQuery : RealtyQueryBase<UserPagedResultGraphType, PagedResultDto<UserDto>>
    {
        private readonly UserManager _userManager;
        private readonly IRepository<OrganizationUnit, long> _organizationUnitRepository;
        private readonly IRepository<UserOrganizationUnit, long> _userOrganizationUnitRepository;
        private readonly RoleManager _roleManager;

        public static class Args
        {
            public const string Id = "id";
            public const string Name = "name";
            public const string Surname = "surname";
            public const string EmailAddress = "emailAddress";
            public const string RoleId = "roleId";
            public const string Filter = "filter";
            public const string OnlyLockedUsers = "onlyLockedUsers";
            public const string Sorting = "sorting";
            public const string SkipCount = "skipCount";
            public const string MaxResultCount = "MaxResultCount";
        }

        public UserQuery(UserManager userManager,
            IRepository<UserOrganizationUnit, long> userOrganizationUnitRepository,
            IRepository<OrganizationUnit, long> organizationUnitRepository,
            RoleManager roleManager)
        : base("users", new Dictionary<string, Type>
        {
            {Args.Id, typeof(IdGraphType)},
            {Args.Name, typeof(StringGraphType)},
            {Args.Surname, typeof(StringGraphType)},
            {Args.EmailAddress, typeof(StringGraphType)},
            {Args.RoleId, typeof(IntGraphType)},
            {Args.OnlyLockedUsers, typeof(BooleanGraphType)},
            {Args.Sorting, typeof(StringGraphType)},
            {Args.Filter, typeof(StringGraphType)},
            {Args.SkipCount, typeof(IntGraphType)},
            {Args.MaxResultCount, typeof(IntGraphType)}
        })
        {
            _userManager = userManager;
            _userOrganizationUnitRepository = userOrganizationUnitRepository;
            _organizationUnitRepository = organizationUnitRepository;
            _roleManager = roleManager;
        }

        [AbpAuthorize(AppPermissions.Pages_Administration_Users)]
        protected override async Task<PagedResultDto<UserDto>> Resolve(ResolveFieldContext<object> context)
        {
            var query = _userManager.Users.AsNoTracking();

            query = IncludeQuery(query, context);

            query = FilterQuery(query, context);

            var totalCount = await query.CountAsync();

            var users = await FetchUsers(query, context);

            var userDtos = Mapper.Map<List<UserDto>>(users);

            await IncludeDetails(context, users, userDtos);

            return new PagedResultDto<UserDto>(totalCount, userDtos);
        }

        private static async Task<List<User>> FetchUsers(IQueryable<User> query, ResolveFieldContext<object> context)
        {
            return await query
                .OrderBy(context.GetArgument(Args.Sorting, "Name,Surname"))
                .PageBy(context.GetArgument<int>(Args.SkipCount),
                    context.GetArgument(Args.MaxResultCount, AppConsts.DefaultPageSize))
                .ToListAsync();
        }

        private async Task IncludeDetails(ResolveFieldContext<object> context, List<User> users, List<UserDto> userDtos)
        {
            if (context.HasSelectionField(UserType.ChildFields.GetFieldSelector(UserType.ChildFields.Roles)))
            {
                AddRolesOfUsers(users, userDtos);
            }

            if (context.HasSelectionField(UserType.ChildFields.GetFieldSelector(UserType.ChildFields.OrganizationUnits)))
            {
                await AddOrganizationUnitsOfUsers(users, userDtos);
            }
        }

        private void AddRolesOfUsers(List<User> users, List<UserDto> userDtos)
        {
            var roles = GetRolesOfUsers(users);

            foreach (var user in users)
            {
                userDtos
                    .Single(x => x.Id == user.Id)
                    .Roles = roles.Where(role => user.Roles.Select(x => x.RoleId).Contains(role.Id)).ToList();
            }
        }

        private List<UserDto.RoleDto> GetRolesOfUsers(List<User> users)
        {
            var roleIds = new List<int>();
            foreach (var user in users)
            {
                foreach (var roleId in user.Roles.Select(x => x.RoleId))
                {
                    roleIds.AddIfNotContains(roleId);
                }
            }

            var roles = _roleManager.Roles.Where(x => roleIds.Contains(x.Id));
            return Mapper.Map<List<UserDto.RoleDto>>(roles);
        }

        private async Task<List<UserDto>> AddOrganizationUnitsOfUsers(List<User> users, List<UserDto> userDtos)
        {
            var organizationUnitsOfUsers = await GetOrganizationUnitsOfUsersAsync(users.Select(x => x.Id).Distinct());

            userDtos.ForEach(userDto =>
            {
                var orgUnitOfUser = organizationUnitsOfUsers.FirstOrDefault(ou => ou.UserId == userDto.Id);
                if (orgUnitOfUser != null)
                {
                    userDto.OrganizationUnits = Mapper.Map<List<UserDto.OrganizationUnitDto>>(
                        orgUnitOfUser.OrganizationUnits
                    );
                }
            });

            return userDtos;
        }

        private async Task<List<OrganizationUnitsOfUser>> GetOrganizationUnitsOfUsersAsync(IEnumerable<long> userIdList)
        {
            if (userIdList == null)
            {
                return new List<OrganizationUnitsOfUser>();
            }

            //TODO: Try to reduce to single query

            var userOrgUnits = (await _userOrganizationUnitRepository.GetAll().Where(x => userIdList.Contains(x.UserId))
                .Select(u => new { u.UserId, u.OrganizationUnitId }).ToListAsync()
                )
                .GroupBy(x => x.UserId)
                .Select(x => new
                {
                    UserId = x.Key,
                    OrganizationUnitIds = x.Select(y => y.OrganizationUnitId).ToList()
                }).ToList();

            var distinctOrgUnitIds = new List<long>();
            foreach (var organizationUnitsOfUser in userOrgUnits)
            {
                foreach (var organizationUnitId in organizationUnitsOfUser.OrganizationUnitIds)
                {
                    distinctOrgUnitIds.AddIfNotContains(organizationUnitId);
                }
            }

            var organizationUnits = await _organizationUnitRepository
                .GetAll()
                .Where(x => distinctOrgUnitIds.Contains(x.Id))
                .ToListAsync();

            return userOrgUnits.Select(userOrgUnit => new OrganizationUnitsOfUser
            {
                UserId = userOrgUnit.UserId,
                OrganizationUnits = organizationUnits.Where(x => userOrgUnit.OrganizationUnitIds.Contains(x.Id)).ToList()
            }).ToList();
        }

        private static IQueryable<User> IncludeQuery(IQueryable<User> query, ResolveFieldContext<object> context)
        {
            if (context.HasSelectionField(UserType.ChildFields.GetFieldSelector(UserType.ChildFields.Roles)))
            {
                query = query.Include(x => x.Roles);
            }

            if (context.HasSelectionField(UserType.ChildFields.GetFieldSelector(UserType.ChildFields.OrganizationUnits)))
            {
                query = query.Include(x => x.OrganizationUnits);
            }

            return query;
        }

        private static IQueryable<User> FilterQuery(IQueryable<User> query, ResolveFieldContext<object> context)
        {
            context
                .ContainsArgument<long>(Args.Id,
                    id => query = query.Where(u => u.Id == id))
                .ContainsArgument<string>(Args.Name,
                    name => query = query.Where(u => u.Name == name))
                .ContainsArgument<string>(Args.Surname,
                    surname => query = query.Where(u => u.Surname == surname))
                .ContainsArgument<string>(Args.EmailAddress,
                    email => query = query.Where(u => u.EmailAddress == email))
                .ContainsArgument<int?>(Args.RoleId,
                    roleId => query = query.Where(u => u.Roles.Any(r => r.RoleId == roleId.Value)))
                .ContainsArgument<bool>(Args.OnlyLockedUsers,
                    onlyLocked => query = query.WhereIf(onlyLocked,
                        u => u.LockoutEndDateUtc.HasValue && u.LockoutEndDateUtc.Value > DateTime.UtcNow))
                .ContainsArgument<string>(Args.Filter, filter => query = query.WhereIf(!string.IsNullOrWhiteSpace(filter),
                        u => u.Name.Contains(filter) ||
                        u.Surname.Contains(filter) ||
                        u.UserName.Contains(filter) ||
                        u.EmailAddress.Contains(filter)));

            return query;
        }

        private class OrganizationUnitsOfUser
        {
            public long UserId { get; set; }

            public List<OrganizationUnit> OrganizationUnits { get; set; }
        }
    }
}