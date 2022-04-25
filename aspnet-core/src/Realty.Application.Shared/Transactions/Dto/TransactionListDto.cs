using System;
using Abp.Application.Services.Dto;

namespace Realty.Transactions.Dto
{
    public class TransactionListDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public TransactionStatus Status { get; set; }
        public TransactionType Type { get; set; }
        
        public string Customer { get; set; }
        public string Agent { get; set; }
        public DateTime CreationTime { get; set; }
        public DateTime? LastModificationTime { get; set; }
    }
}
