using Realty.Contacts.Dto;

namespace Realty.SigningParticipants.Dto
{
    public class SigningViewerDto
    {
        public SigningViewerDto()
        {
        }

        public SigningViewerDto(ContactListDto contact)
        {
            Contact = contact;
        }

        public ContactListDto Contact { get; set; }
    }
}
