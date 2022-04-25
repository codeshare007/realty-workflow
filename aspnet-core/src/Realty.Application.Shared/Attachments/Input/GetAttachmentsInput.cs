using Abp.Runtime.Validation;
using Realty.Dto;

namespace Realty.Attachments.Input
{
    public class GetAttachmentsInput : PagedAndSortedInputDto, IShouldNormalize
    {
        public string Filter { get; set; }

        public void Normalize()
        {
            if (string.IsNullOrEmpty(Sorting))
            {
                Sorting = "CreationTime DESC";
            }

            Filter = Filter?.Trim();
        }
    }
}
