using Abp.Runtime.Validation;
using Realty.Dto;
using System;

namespace Realty.LeadContacts.Input
{
    public class GetLeadContactsInput : PagedAndSortedInputDto, IShouldNormalize
    {
        public string Filter { get; set; }

        public Guid? LeadId { get; set; }

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
