using System;
using System.ComponentModel.DataAnnotations;
using Abp.Application.Services.Dto;

namespace Realty.Signings.Input
{
    public class SigningParticipantCustomDataInput : EntityDto<Guid>
    {
        [EmailAddress]
        public string EmailAddress { get; set; }
        public string Subject { get; set; }
        public string Message { get; set; }
    }
}
