using System;
using AutoMapper;
using Realty.Contacts.Dto;
using Realty.Contacts.Input;
using Realty.Signings;
using Realty.Signings.Dto;
using Realty.Signings.Input;

namespace Realty.AutoMapping.Profiles
{
    public class SigningMappingProfile : Profile
    {
        public SigningMappingProfile()
        {
            CreateMap<CreateContactInput, SigningParticipant>();
            CreateMap<UpdateContactInput, SigningParticipant>()
                .ForMember(entity => entity.Id, o => o.Ignore());

            CreateMap<SigningEditDto, Signing>()
                .ForMember(l => l.Status, options => options.Ignore())
                .ForMember(l => l.Agent, options => options.Ignore())
                .ForMember(l => l.AgentId, options => options.Ignore());

            CreateMap<Signing, SigningEditDto>()
                .ForMember(a => a.Agent, o => o.MapFrom(c => c.Agent != null ? c.Agent.FullName : null))
                .ForMember(a => a.AgentId, o => o.MapFrom(c => c.Agent != null ? c.Agent.PublicId : (Guid?)null))
                .ForMember(a => a.DocumentsCount, o => o.MapFrom(c => c.Forms != null ? c.Forms.Count : 0))
                .ForMember(a => a.Transaction, o => o.MapFrom(c => c.Transaction != null ? c.Transaction.Name : null))
                .ForMember(dto => dto.SignedFileGenerated, o => o.MapFrom(e => e.SignedFile != null))
                .ForMember(dto => dto.Settings, o => o.MapFrom((entity, dto, _) => new SigningSettingsDto
                {
                    ReminderSettings = new ReminderSettingsDto(entity.ReminderSettings?.DispatchingFrequency ?? ReminderFrequency.Never),
                    ExpirationSettings = new ExpirationSettingsDto(entity.ExpirationSettings?.ExpirationDate)
                }));

            CreateMap<Signing, SigningListDto>()
                .ForMember(a => a.Agent, o => o.MapFrom(c => c.Agent != null ? c.Agent.FullName : null))
                .ForMember(dto => dto.SignedFileGenerated, o => o.MapFrom(e => e.SignedFile != null))
                .ForMember(a => a.Transaction, o => o.MapFrom(c => c.Transaction != null ? c.Transaction.Name : null))
                .ForMember(a => a.TransactionId, o => o.MapFrom(c => c.Transaction != null ? c.Transaction.Id : (Guid?)null));

            CreateMap<CreateSigningInput, Signing>()
                .ForMember(l => l.Agent, options => options.Ignore())
                .ForMember(l => l.AgentId, options => options.Ignore());

            CreateMap<SigningParticipant, ContactListDto>();
        }
    }
}
