using System.ComponentModel.DataAnnotations;

namespace Realty.Communications.Dto
{
    public class CommunicationSettingsDto
    {
        [Required]
        public CommunicationImapSettingsDto Imap { get; set; }
        
        [Required]
        public CommunicationSmtpSettingsDto Smtp { get; set; }
    }
}