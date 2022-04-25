using Abp.Runtime.Validation;
using Realty.Dto;
using System;

namespace Realty.SigningParticipants.Input
{
    public class GetSigningParticipantsInput : PagedAndSortedInputDto, IShouldNormalize
    {
        public Guid? SigningId { get; set; }

        public void Normalize()
        {
            if (string.IsNullOrEmpty(Sorting))
            {
                Sorting = "FirstName";
            }
        }
    }
}
