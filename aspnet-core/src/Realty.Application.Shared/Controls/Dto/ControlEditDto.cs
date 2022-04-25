using System;
using Abp.Application.Services.Dto;
using Realty.Forms;
using static Realty.Controls.Constants;

namespace Realty.Controls.Dto
{
    public class ControlEditDto: EntityDto<Guid>
    {
        public ControlType Type { get; set; }

        public ControlLayer Layer { get; set; }

        public string Label { get; set; }

        public ControlPositionDto Position { get; set; }
        public TextPositionType TextPosition { get; set; }

        public ControlSizeDto Size { get; set; }

        public ControlFontDto Font { get; set; }

        public ControlValueDto Value { get; set; }
        
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
