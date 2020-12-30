using System.Threading.Tasks;
using Abp.Application.Services;
using Realty.Communications.Dto;

namespace Realty.Communications
{
    public interface ICommunicationAppService : IApplicationService
    {
        Task<GetCommunicationTopicsOutput> GetCommunicationTopics();

        Task<GetCommunicationTopicDetailsOutput> GetCommunicationTopicDetails(GetCommunicationTopicDetailsInput input);

        Task SendMessage(CommunicationSendMessageInput input);

        Task<CommunicationSettingsDto> GetSettings();

        Task UpdateSettings(CommunicationSettingsDto input);
    }
}
