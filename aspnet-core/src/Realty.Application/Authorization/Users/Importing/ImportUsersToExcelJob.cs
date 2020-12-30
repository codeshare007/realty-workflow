using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Authorization.Users;
using Abp.BackgroundJobs;
using Abp.Dependency;
using Abp.Domain.Uow;
using Abp.Extensions;
using Abp.IdentityFramework;
using Abp.Localization;
using Abp.Localization.Sources;
using Abp.ObjectMapping;
using Abp.Threading;
using Abp.UI;
using Microsoft.AspNetCore.Identity;
using Realty.Authorization.Roles;
using Realty.Authorization.Users.Dto;
using Realty.Authorization.Users.Importing.Dto;
using Realty.Notifications;
using Realty.Storage;

namespace Realty.Authorization.Users.Importing
{
    public class ImportUsersToExcelJob : BackgroundJob<ImportUsersFromExcelJobArgs>, ITransientDependency
    {
        private readonly RoleManager _roleManager;
        private readonly IUserListExcelDataReader _userListExcelDataReader;
        private readonly IInvalidUserExporter _invalidUserExporter;
        private readonly IUserPolicy _userPolicy;
        private readonly IEnumerable<IPasswordValidator<User>> _passwordValidators;
        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly IAppNotifier _appNotifier;
        private readonly IBinaryObjectManager _binaryObjectManager;
        private readonly IObjectMapper _objectMapper;
        private readonly IUnitOfWorkManager _unitOfWorkManager;
        public UserManager UserManager { get; set; }

        public ImportUsersToExcelJob(
            RoleManager roleManager,
            IUserListExcelDataReader userListExcelDataReader,
            IInvalidUserExporter invalidUserExporter,
            IUserPolicy userPolicy,
            IEnumerable<IPasswordValidator<User>> passwordValidators,
            IPasswordHasher<User> passwordHasher,
            IAppNotifier appNotifier,
            IBinaryObjectManager binaryObjectManager,
            IObjectMapper objectMapper,
            IUnitOfWorkManager unitOfWorkManager)
        {
            _roleManager = roleManager;
            _userListExcelDataReader = userListExcelDataReader;
            _invalidUserExporter = invalidUserExporter;
            _userPolicy = userPolicy;
            _passwordValidators = passwordValidators;
            _passwordHasher = passwordHasher;
            _appNotifier = appNotifier;
            _binaryObjectManager = binaryObjectManager;
            _objectMapper = objectMapper;
            _unitOfWorkManager = unitOfWorkManager;
        }

        public override void Execute(ImportUsersFromExcelJobArgs args)
        {
            var users = GetUserListFromExcelOrNull(args);
            if (users == null || !users.Any())
            {
                SendInvalidExcelNotification(args);
                return;
            }

            CreateUsers(args, users);
        }

        private List<ImportUserDto> GetUserListFromExcelOrNull(ImportUsersFromExcelJobArgs args)
        {
            using (var uow = _unitOfWorkManager.Begin())
            {
                using (CurrentUnitOfWork.SetTenantId(args.TenantId))
                {
                    try
                    {
                        var file = AsyncHelper.RunSync(() => _binaryObjectManager.GetOrNullAsync(args.BinaryObjectId));
                        return _userListExcelDataReader.GetUsersFromExcel(file.Bytes);
                    }
                    catch (Exception)
                    {
                        return null;
                    }
                    finally
                    {
                        uow.Complete();
                    }
                }
            }
        }

        private void CreateUsers(ImportUsersFromExcelJobArgs args, List<ImportUserDto> users)
        {
            var invalidUsers = new List<ImportUserDto>();

            foreach (var user in users)
            {
                using (var uow = _unitOfWorkManager.Begin())
                {
                    using (CurrentUnitOfWork.SetTenantId(args.TenantId))
                    {
                        if (user.CanBeImported())
                        {
                            try
                            {
                                AsyncHelper.RunSync(() => CreateUserAsync(user));
                            }
                            catch (UserFriendlyException exception)
                            {
                                user.Exception = exception.Message;
                                invalidUsers.Add(user);
                            }
                            catch (Exception exception)
                            {
                                user.Exception = exception.ToString();
                                invalidUsers.Add(user);
                            }
                        }
                        else
                        {
                            invalidUsers.Add(user);
                        }
                    }

                    uow.Complete();
                }
            }

            using (var uow = _unitOfWorkManager.Begin())
            {
                using (CurrentUnitOfWork.SetTenantId(args.TenantId))
                {
                    AsyncHelper.RunSync(() => ProcessImportUsersResultAsync(args, invalidUsers));
                }

                uow.Complete();
            }
        }

        private async Task CreateUserAsync(ImportUserDto input)
        {
            var tenantId = CurrentUnitOfWork.GetTenantId();

            if (tenantId.HasValue)
            {
                await _userPolicy.CheckMaxUserCountAsync(tenantId.Value);
            }

            var user = _objectMapper.Map<User>(input); //Passwords is not mapped (see mapping configuration)
            user.Password = input.Password;
            user.TenantId = tenantId;

            if (!input.Password.IsNullOrEmpty())
            {
                await UserManager.InitializeOptionsAsync(tenantId);
                foreach (var validator in _passwordValidators)
                {
                    (await validator.ValidateAsync(UserManager, user, input.Password)).CheckErrors();
                }

                user.Password = _passwordHasher.HashPassword(user, input.Password);
            }

            user.Roles = new List<UserRole>();
            var roleList = _roleManager.Roles.ToList();

            foreach (var roleName in input.AssignedRoleNames)
            {
                var correspondingRoleName = GetRoleNameFromDisplayName(roleName, roleList);
                var role = await _roleManager.GetRoleByNameAsync(correspondingRoleName);
                user.Roles.Add(new UserRole(tenantId, user.Id, role.Id));
            }

            (await UserManager.CreateAsync(user)).CheckErrors();
        }

        private async Task ProcessImportUsersResultAsync(ImportUsersFromExcelJobArgs args,
            List<ImportUserDto> invalidUsers)
        {
            if (invalidUsers.Any())
            {
                var file = _invalidUserExporter.ExportToFile(invalidUsers);
                await _appNotifier.SomeUsersCouldntBeImported(args.User, file.FileToken, file.FileType, file.FileName);
            }
            else
            {
                await _appNotifier.SendMessageAsync(
                    args.User,
                    new LocalizableString("AllUsersSuccessfullyImportedFromExcel", RealtyConsts.LocalizationSourceName),
                    null,
                    Abp.Notifications.NotificationSeverity.Success);
            }
        }

        private void SendInvalidExcelNotification(ImportUsersFromExcelJobArgs args)
        {
            using (var uow = _unitOfWorkManager.Begin())
            {
                using (CurrentUnitOfWork.SetTenantId(args.TenantId))
                {
                    AsyncHelper.RunSync(() => _appNotifier.SendMessageAsync(
                        args.User,
                        new LocalizableString("FileCantBeConvertedToUserList", RealtyConsts.LocalizationSourceName),
                        null,
                        Abp.Notifications.NotificationSeverity.Warn));
                }
                uow.Complete();
            }
        }

        private string GetRoleNameFromDisplayName(string displayName, List<Role> roleList)
        {
            return roleList.FirstOrDefault(
                r => r.DisplayName?.ToLowerInvariant() == displayName?.ToLowerInvariant()
            )?.Name;
        }
    }
}
