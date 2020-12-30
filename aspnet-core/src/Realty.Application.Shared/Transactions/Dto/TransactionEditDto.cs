using System;
using Abp.Application.Services.Dto;

namespace Realty.Transactions.Dto
{
    public class TransactionEditDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public TransactionStatus Status { get; set; }
        public TransactionType Type { get; set; }
        public string Notes { get; set; }

        public string Customer { get; set; }
        public string Agent { get; set; }
        public string ListingCode { get; set; }
        public string LeadCode { get; set; }
        public Guid? CustomerId { get; set; }
        public Guid? AgentId { get; set; }
        public Guid? LeadId { get; set; }
        public Guid? ListingId { get; set; }
    }
}
