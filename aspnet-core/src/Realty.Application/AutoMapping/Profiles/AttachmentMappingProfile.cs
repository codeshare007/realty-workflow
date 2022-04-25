using AutoMapper;
using Realty.Attachments;
using Realty.Attachments.Dto;
using Realty.Attachments.Input;

namespace Realty.AutoMapping.Profiles
{
    public class AttachmentMappingProfile: Profile
    {
        public AttachmentMappingProfile()
        {
            CreateMap<CreateAttachmentInput, Attachment>()
                .ForMember(entity => entity.Id, o => o.Ignore());

            CreateMap<Attachment, AttachmentListDto>()
                .ForMember(dto => dto.FileId, o => o.MapFrom(a => a.File.Id));
        }
    }
}
