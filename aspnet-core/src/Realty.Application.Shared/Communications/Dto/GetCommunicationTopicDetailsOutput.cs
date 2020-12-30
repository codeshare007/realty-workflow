using System.Collections.Generic;
using Abp.Application.Services.Dto;

namespace Realty.Communications.Dto
{
    public class GetCommunicationTopicDetailsOutput : IListResult<CommunicationItemDto>
    {
        public IReadOnlyList<CommunicationItemDto> Items { get; set; }

        public string Contact { get; set; }

        public long? UserId { get; set; }

        public string FullName { get; set; }
    }
}
