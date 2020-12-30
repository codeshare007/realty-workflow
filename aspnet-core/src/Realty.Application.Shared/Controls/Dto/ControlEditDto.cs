using System;
using Abp.Application.Services.Dto;
using Realty.Forms;

namespace Realty.Controls.Dto
{
    public class ControlEditDto: EntityDto<Guid>
    {
        public ControlType Type { get; set; }

        public ControlLayer Layer { get; set; }

        public string Label { get; set; }

        public ControlPositionDto Position { get; set; }

        public ControlSizeDto Size { get; set; }

        public ControlFontDto Font { get; set; }
        public ControlValueDto Value { get; set; }
    }
}
