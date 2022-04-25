using System;
using Abp.Application.Services.Dto;
using Realty.Forms;
using static Realty.Controls.Constants;

namespace Realty.Controls.Input
{
    public class ControlInput: EntityDto<Guid>
    {
        public ControlType Type { get; set; }

        public ControlLayer Layer { get; set; }

        public ControlPositionInput Position { get; set; }
        public TextPositionType TextPosition { get; set; }

        public ControlSizeInput Size { get; set; }

        public ControlFontInput Font { get; set; }

        public Guid? ParticipantId { get; set; }
        public Guid? ParticipantMappingItemId { get; set; }

        public string Placeholder { get; set; }
        public bool IsProtected { get; set; }
        public bool IsRequired { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }
        public string AdditionalSettings { get; set; }
    }
}
