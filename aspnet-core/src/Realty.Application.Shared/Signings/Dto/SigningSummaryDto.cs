using System;
using Abp.Application.Services.Dto;

namespace Realty.Signings.Dto
{
    public class SigningSummaryDto : EntityDto<Guid>
    {
        public SigningParticipantsDto Participants { get; set; }
    }
}
