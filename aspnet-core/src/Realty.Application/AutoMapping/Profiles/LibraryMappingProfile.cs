using AutoMapper;
using Realty.Libraries;
using Realty.Libraries.Input;

namespace Realty.AutoMapping.Profiles
{
    public class LibraryMappingProfile: Profile
    {
        public LibraryMappingProfile()
        {
            CreateMap<Library, LibraryListDto>();
            CreateMap<CreateLibraryInput, Library>();
            CreateMap<Library, LibraryEditDto>();
            CreateMap<UpdateLibraryInput, Library>()
                .ForMember(entity => entity.Id, o => o.Ignore());
        }
    }
}
