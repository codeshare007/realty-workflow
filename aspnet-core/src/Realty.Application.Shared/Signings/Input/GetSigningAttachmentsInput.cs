using System;
using Realty.Attachments.Input;

namespace Realty.Signings.Input
{
    public class GetSigningAttachmentsInput: GetAttachmentsInput
    {
        public Guid Id { get; set; }
    }
}
