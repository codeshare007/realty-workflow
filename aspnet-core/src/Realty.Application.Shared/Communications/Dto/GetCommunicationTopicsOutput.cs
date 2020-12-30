using System.Collections.Generic;
using Abp.Application.Services.Dto;

namespace Realty.Communications.Dto
{
    public class GetCommunicationTopicsOutput : ListResultDto<CommunicationTopicListDto>
    {
        public GetCommunicationTopicsOutput(bool isInitialized, IReadOnlyList<CommunicationTopicListDto> items) : base(items) =>
            IsInitialized = isInitialized;

        public bool IsInitialized { get; set; }
    }
}
