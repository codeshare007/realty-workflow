using Abp.Runtime.Validation;
using Realty.Dto;
using System;

namespace Realty.SigningContacts.Input
{
    public class GetSigningContactsInput : PagedAndSortedInputDto, IShouldNormalize
    {
        public string Filter { get; set; }

        public Guid? SigningId { get; set; }

        public void Normalize()
        {
            if (string.IsNullOrEmpty(Sorting))
            {
                Sorting = "FirstName";
            }

            Filter = Filter?.Trim();
        }
    }
}
