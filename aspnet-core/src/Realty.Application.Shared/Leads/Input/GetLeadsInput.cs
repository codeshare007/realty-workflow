using Abp.Runtime.Validation;
using Realty.Dto;
using System;

namespace Realty.Leads.Input
{
    public class GetLeadsInput : PagedAndSortedInputDto, IShouldNormalize
    {
        public string Filter { get; set; }

        public Guid? AgentId { get; set; }

        public Guid? CustomerId { get; set; }

        public void Normalize()
        {
            if (string.IsNullOrEmpty(Sorting))
            {
                Sorting = "LastModificationTime desc";
            }

            Filter = Filter?.Trim();
        }
    }
}
