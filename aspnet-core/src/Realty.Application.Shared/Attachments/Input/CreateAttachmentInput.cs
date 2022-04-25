using System;
using System.ComponentModel.DataAnnotations;

namespace Realty.Attachments.Input
{
    public class CreateAttachmentInput
    {
        [MinLength(Constants.MinNameLength)]
        [MaxLength(Constants.MaxNameLength)]
        public string Name { get; set; }

        public Guid FileId { get; set; }
    }
}
