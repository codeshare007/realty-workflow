using System;

namespace Realty.Controls.Input
{
    public class ControlValueInput
    {
        public Guid? LibraryId { get; set; }
        public Guid? TransactionId { get; set; }
        public Guid? SigningId { get; set; }
        public string ParticipantCode { get; set; }
        public Guid FormId { get; set; }
        public Guid PageId { get; set; }
        public Guid ControlId { get; set; }

        public string Value { get; set; }
    }
}
