using System.ComponentModel.DataAnnotations;

namespace Realty.Communications.Dto
{
    public class CommunicationSendMessageInput
    {
        [Required]
        public string Contact { get; set; }

        [Required]
        public string Subject { get; set; }

        [Required]
        public string Message { get; set; }
    }
}