using Abp.Runtime.Validation;
using Realty.Dto;
using System;

namespace Realty.Signings.Input
{
    public class GetSigningsInput : PagedAndSortedInputDto, IShouldNormalize
    {
        public string Filter { get; set; }

        public Guid? AgentId { get; set; }
        public Guid? TransactionId { get; set; }

        public void Normalize()
        {
            if (string.IsNullOrEmpty(Sorting))
            {
                Sorting = "LastModificationTime DESC";
            }

            Filter = Filter?.Trim();
        }
    }
}
