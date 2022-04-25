using System;
using Abp.Application.Services.Dto;
using Realty.Attachments.Input;

namespace Realty.Signings.Input
{
    public class CreateSigningAttachmentInput
    {
        public string ParticipantCode { get; set; }
        public CreateAttachmentInput Attachment { get; set; }
    }
}
