using System;
using Abp.Application.Services.Dto;

namespace Realty.Signings.Dto
{
    public class SigningEditDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public string Notes { get; set; }

        public string Agent { get; set; }
        public Guid? AgentId { get; set; }

        public string Transaction { get; set; }
        public Guid? TransactionId { get; set; }
        public int DocumentsCount { get; set; }
    }
}
