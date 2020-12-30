using System.Collections.Generic;
using Abp;
using Realty.Chat.Dto;
using Realty.Dto;

namespace Realty.Chat.Exporting
{
    public interface IChatMessageListExcelExporter
    {
        FileDto ExportToFile(UserIdentifier user, List<ChatMessageExportDto> messages);
    }
}
