using AutoMapper;
using Realty.Controls;
using Realty.Controls.Dto;
using Realty.Controls.Input;
using Realty.Forms;
using Realty.Forms.Input;
using Realty.Forms.Dto;
using Realty.Pages;
using Realty.Pages.Dto;

namespace Realty.AutoMapping.Profiles
{
    public class FormMappingProfile: Profile
    {
        public FormMappingProfile()
        {
            CreateMap<Form, FormListDto>()
                .ForMember(dto => dto.ContentType, o => o.MapFrom(e => e.File.ContentType))
                .ForMember(dto => dto.DisplayOrder, o => o.MapFrom(e => e.DisplayOrder))
                .ForMember(dto => dto.SignedFileGenerated, o => o.MapFrom(e => e.SignedFile != null));

            CreateMap<CreateFormInput, Form>();

            CreateMap<Form, FormEditDto>();

            CreateMap<Page, PageEditDto>()
                .ForMember(dto => dto.FileId, o => o.MapFrom(e => e.File.Id));

            CreateMap<ParticipantMappingItemsInput, ParticipantMappingItem>();
            CreateMap<ParticipantMappingItem, ParticipantMappingItemDto>();

            CreateMap<Control, ControlEditDto>()
                .ForMember(dto => dto.Size, o => o.MapFrom(e => new ControlSizeDto(e.Size.Width, e.Size.Height)))
                .ForMember(dto => dto.Position, o => o.MapFrom(e => new ControlPositionDto(e.Position.Top, e.Position.Left)))
                .ForMember(dto => dto.Font, o => o.MapFrom(e => new ControlFontDto(e.Font.SizeInPx)))
                .ForMember(dto => dto.Value, o => o.MapFrom(e => new ControlValueDto(e.Value != null ? e.Value.Value : null, e.Value.UpdateValueDate)));

            CreateMap<ControlInput, Control>()
                .ForAllMembers(o => o.Ignore());
        }
    }
}
