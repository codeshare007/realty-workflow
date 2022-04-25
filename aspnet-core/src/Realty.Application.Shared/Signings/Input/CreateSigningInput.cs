using System;
using Realty.Signings.Dto;

namespace Realty.Signings.Input
{
    public class CreateSigningInput
    {
        public string Name { get; set; }
        public string Notes { get; set; }
        public Guid? AgentId { get; set; }
        public Guid? TransactionId { get; set; }

        public SigningSettingsDto Settings { get; set; }
    }
}
