using AutoMapper;
using Realty.Contacts;
using Realty.Contacts.Input;

namespace Realty.AutoMapping.Profiles
{
    public class CommonMappingProfile: Profile
    {
        public CommonMappingProfile()
        {
            CreateMap<CreateAddressInput, Address>()
                .ForMember(entity => entity.Id, o => o.Ignore());
            CreateMap<UpdateAddressInput, Address>()
                .ForMember(entity => entity.Id, o => o.Ignore());
        }
    }
}
