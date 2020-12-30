using System;

namespace Realty.Controls.Input
{
    public class ControlValueInput
    {
        public Guid DocumentId { get; set; }

        public Guid PageId { get; set; }

        public Guid ControlId { get; set; }

        public string Value { get; set; }

        public string AdditionalData { get; set; }
    }
}
