using System;
using Abp.Application.Services.Dto;
using Realty.Contacts.Input;

namespace Realty.SigningParticipants.Input
{
    public class ResendSigningRequestAccessEmail
    {
        public Guid SigningId { get; set; }
        public Guid SigningRequestAccessId { get; set; }
    }
}
