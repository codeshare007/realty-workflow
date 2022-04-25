using System;
using Abp.Application.Services.Dto;
using Realty.Contacts.Dto;
using Realty.Signings;

namespace Realty.SigningParticipants.Dto
{
    public class SigningAccessRequestDto : EntityDto<Guid>
    {
        public SigningAccessRequestDto(Guid id, ContactListDto participant, DateTime? lastViewDate, SigningRequestStatus? status = null, string comment = null)
        {
            this.Id = id;
            this.Participant = participant;
            this.LastViewDate = lastViewDate;
            this.Status = status;
            this.Comment = comment;
        }

        public DateTime? LastViewDate { get; set; }
        public SigningRequestStatus? Status { get; set; }

        public string Comment { get; set; }

        public ContactListDto Participant { get; set; }
    }
}
