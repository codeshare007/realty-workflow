using System.Collections.Generic;
using Realty.Authorization.Users.Importing.Dto;
using Abp.Dependency;

namespace Realty.Authorization.Users.Importing
{
    public interface IUserListExcelDataReader: ITransientDependency
    {
        List<ImportUserDto> GetUsersFromExcel(byte[] fileBytes);
    }
}
