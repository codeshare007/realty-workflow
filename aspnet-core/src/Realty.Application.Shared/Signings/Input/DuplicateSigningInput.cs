using System;
using Abp.Application.Services.Dto;

namespace Realty.Signings.Input
{
    public class DuplicateSigningInput : EntityDto<Guid>
    {
        public string Name { get; set; }
        public bool ForNextSinging { get; set; }
        public bool IsReset { get; set; }
    }
}
