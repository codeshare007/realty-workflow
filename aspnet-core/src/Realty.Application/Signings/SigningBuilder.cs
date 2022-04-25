using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using Abp;
using Abp.Dependency;
using Abp.ObjectMapping;
using Realty.Contacts.Dto;
using Realty.SigningParticipants.Dto;
using Realty.Signings.AccessRequests;
using Realty.Signings.Dto;
using Realty.Signings.Input;

namespace Realty.Signings
{
    public class SigningBuilder : ITransientDependency
    {
        private readonly IObjectMapper _objectMapper;

        public SigningBuilder(IObjectMapper objectMapper)
        {
            _objectMapper = objectMapper;
        }

        public SigningSummaryDto GetSummary(Signing signing)
        {
            return new SigningSummaryDto
            {
                Participants = GetSigningParticipants(signing)
            };
        }

        public void Publish(Signing signing, PublishSigningInput input)
        {
            HandleAccessRequests(signing, input.ParticipantCustomData.ToImmutableList());
            HandleEmailUpdates(signing, input.ParticipantCustomData.ToImmutableList());

            signing.Publish();
        }

        private SigningParticipantsDto GetSigningParticipants(Signing signing)
        {
            Check.NotNull(signing, nameof(signing));

            var controlParticipants = signing.Forms
                .SelectMany(f => f.Pages)
                .SelectMany(p => p.Controls)
                .Select(c => c.ParticipantId)
                .ToImmutableArray();

            var signers = new List<SigningSignerDto>();
            var observers = new List<SigningViewerDto>();

            foreach (var participant in signing.Participants)
            {
                var contactDto = _objectMapper.Map<ContactListDto>(participant);

                if (controlParticipants.Any(i => i == participant.Id))
                    signers.Add(new SigningSignerDto(contactDto, controlParticipants.Count(c => c == participant.Id)));
                else
                    observers.Add(new SigningViewerDto(contactDto));
            }

            return new SigningParticipantsDto
            {
                Signers = signers.ToImmutableList(),
                Viewers = observers.ToImmutableList()
            };
        }

        private void HandleAccessRequests(Signing signing, IReadOnlyCollection<SigningParticipantCustomDataInput> customDataInput)
        {
            var controlParticipants = signing.Forms
                .SelectMany(f => f.Pages)
                .SelectMany(p => p.Controls)
                .Select(c => c.ParticipantId)
                .ToImmutableArray();

            foreach (var participant in signing.Participants)
            {
                if (controlParticipants.Any(i => i == participant.Id))
                {
                    var customData = customDataInput?.FirstOrDefault(p => p.Id == participant.Id);

                    signing.AddSigningRequest(participant, new SigningRequestSettings
                    {
                        EmailSubject = customData?.Subject,
                        EmailBody = customData?.Message
                    });
                }
                else
                {
                    signing.AddViewRequest(participant);
                }
            }
        }

        private void HandleEmailUpdates(Signing signing,
            IReadOnlyCollection<SigningParticipantCustomDataInput> customDataInput)
        {
            foreach (var participant in signing.Participants)
            {
                var input = customDataInput.First(s => s.Id == participant.Id);
                if (participant.Email != input.EmailAddress)
                    participant.Email = input.EmailAddress;
            }
        }
    }
}
