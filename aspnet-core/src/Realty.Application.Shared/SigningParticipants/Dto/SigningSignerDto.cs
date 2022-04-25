using Realty.Contacts.Dto;

namespace Realty.SigningParticipants.Dto
{
    public class SigningSignerDto
    {
        public SigningSignerDto()
        {
        }

        public SigningSignerDto(ContactListDto contact, int controlsAmount)
        {
            Contact = contact;
            ControlsAmount = controlsAmount;
        }

        public ContactListDto Contact { get; set; }

        public int ControlsAmount { get; set; }
    }
}
