using System;
using Abp.Application.Services.Dto;
using Realty.Forms;

namespace Realty.Controls.Input
{
    public class ControlInput: EntityDto<Guid>
    {
        public ControlType Type { get; set; }

        public ControlPositionInput Position { get; set; }

        public ControlSizeInput Size { get; set; }

        public ControlFontInput Font { get; set; }

        public long ParticipantId { get; set; }
    }
}
