using System;
using System.ComponentModel.DataAnnotations;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using Realty.Forms;

namespace Realty.Controls
{
    public class Control: FullAuditedEntity<Guid>, IMustHaveTenant
    {
        protected Control()
        {
        }

        public Control(ControlType type, ControlLayer layer, string label)
        {
            Type = type;
            Layer = layer;
            Label = label;
        }

        public ControlType Type { get; private set; }

        public ControlLayer Layer { get; private set; }

        [MaxLength(Constants.LabelMaxLength)]
        public string Label { get; private set; }

        public virtual ControlPosition Position { get; private set; }

        public virtual ControlSize Size { get; private set; }

        public virtual ControlFont Font { get; private set; }

        public virtual ControlValue Value { get; private set; }

        public int TenantId { get; set; }

        public long ParticipantId { get; private set; }

        // Page ID as a shadow property

        public void SetPosition(int top, int left)
        {
            Position = new ControlPosition(top, left);
        }

        public void SetType(ControlType type)
        {
            Type = type;
        }

        public void SetSize(int width, int height)
        {
            Size = new ControlSize(width, height);
        }

        public void SetFont(int sizeInPx)
        {
            Font = new ControlFont(sizeInPx);
        }

        public void SetValue(string value)
        {
            if (Value != null) 
                Value.Value = value;
            else 
                Value = new ControlValue(value);
        }

        public void SetParticipant(long participantId)
        {
            ParticipantId = participantId;
        }
    }
}
