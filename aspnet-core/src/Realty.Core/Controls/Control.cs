using System;
using System.ComponentModel.DataAnnotations;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using Realty.Forms;
using static Realty.Controls.Constants;

namespace Realty.Controls
{
    public class Control: FullAuditedEntity<Guid>, IMustHaveTenant
    {
        protected Control()
        {
        }

        public Control(ControlType type, ControlLayer layer)
        {
            Type = type;
            Layer = layer;
        }

        public ControlType Type { get; private set; }

        public ControlLayer Layer { get; private set; }

        [MaxLength(Constants.PlaceholderMaxLength)]
        public string Placeholder { get; private set; }
        public bool IsProtected { get; private set; }
        public bool IsRequired { get; private set; }
        public TextPositionType TextPosition { get; private set; }

        [MaxLength(Constants.TitleMaxLength)]
        public string Title { get; private set; }
        public string Description { get; private set; }
        public string AdditionalSettings { get; private set; }

        public virtual ControlPosition Position { get; private set; }

        public virtual ControlSize Size { get; private set; }

        public virtual ControlFont Font { get; private set; }

        public virtual ControlValue Value { get; private set; }

        public int TenantId { get; set; }

        public Guid? ParticipantId { get; private set; }
        public Guid? ParticipantMappingItemId { get; private set; }

        // Page ID as a shadow property

        public Control Clone()
        {
            var clonedControl = new Control(this.Type, this.Layer);
            clonedControl.SetPosition(this.Position.Top, this.Position.Left);
            clonedControl.SetDetail(this.Placeholder, this.IsProtected, this.IsRequired, this.Title, this.Description, this.AdditionalSettings);
            clonedControl.SetTextPosition(this.TextPosition);
            clonedControl.SetSize(this.Size.Width, this.Size.Height);
            clonedControl.SetFont(this.Font.SizeInPx);
            clonedControl.SetParticipant(this.ParticipantId);
            clonedControl.SetParticipantMappingItemId(this.ParticipantMappingItemId);

            if (this.Value != null
                && this.Type != ControlType.Signature
                && this.Type != ControlType.SigningDate
                && this.Type != ControlType.Initials)
            {
                clonedControl.SetValue(this.Value.Value, this.Value.IP, this.Value.UpdateValueDate);
            }
            
            return clonedControl;
        }

        public void SetPosition(float top, float left)
        {
            Position = new ControlPosition(top, left);
        }

        public void SetDetail(string placeholder, bool isProtected, bool isRequired, string title, string description, string additionalSettings)
        {
            Placeholder = placeholder;
            IsProtected = isProtected;
            IsRequired = isRequired;
            Title = title;
            Description = description;
            AdditionalSettings = additionalSettings;
        }

        public void SetType(ControlType type)
        {
            Type = type;
        }

        public void SetTextPosition(TextPositionType textPosition)
        {
            TextPosition = textPosition;
        }

        public void SetSize(float width, float height)
        {
            Size = new ControlSize(width, height);
        }

        public void SetFont(int sizeInPx)
        {
            Font = new ControlFont(sizeInPx);
        }

        public void SetValue(string value, string ip, DateTime updateValueDate)
        {
            if (Value != null)
                Value.SetValue(value, ip, updateValueDate);
            else 
                Value = new ControlValue(value, ip, updateValueDate);
        }

        public void SetParticipant(Guid? participantId)
        {
            ParticipantId = participantId.HasValue && participantId != Guid.Empty ? participantId : (Guid?)null;
        }

        public void SetParticipantMappingItemId(Guid? partcipantMappingItemId)
        {
            ParticipantMappingItemId = partcipantMappingItemId.HasValue && partcipantMappingItemId != Guid.Empty ? partcipantMappingItemId : (Guid?)null;
        }
    }
}
