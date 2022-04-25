using System;
using Abp.Application.Services.Dto;

namespace Realty.Signings.Dto
{
    public class SigningListDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public string Notes { get; set; }
        public string Agent { get; set; }
        public SigningStatus Status { get; set; }
        public string Transaction { get; set; }
        public Guid? TransactionId { get; set; }
        public string SignedFileGenerated { get; set; }
        public DateTime CreationTime { get; set; }
        public DateTime? LastModificationTime { get; set; }
    }
}
