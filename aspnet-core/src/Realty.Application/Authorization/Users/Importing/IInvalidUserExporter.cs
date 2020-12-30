using System.Collections.Generic;
using Realty.Authorization.Users.Importing.Dto;
using Realty.Dto;

namespace Realty.Authorization.Users.Importing
{
    public interface IInvalidUserExporter
    {
        FileDto ExportToFile(List<ImportUserDto> userListDtos);
    }
}
