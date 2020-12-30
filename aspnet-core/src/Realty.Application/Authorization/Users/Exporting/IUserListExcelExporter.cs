using System.Collections.Generic;
using Realty.Authorization.Users.Dto;
using Realty.Dto;

namespace Realty.Authorization.Users.Exporting
{
    public interface IUserListExcelExporter
    {
        FileDto ExportToFile(List<UserListDto> userListDtos);
    }
}