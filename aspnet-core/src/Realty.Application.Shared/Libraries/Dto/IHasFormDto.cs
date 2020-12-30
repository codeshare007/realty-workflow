using Realty.Forms.Dto;

namespace Realty.Libraries.Dto
{
    public interface IHasFormDto<T>
    {
        T Id { get; set; }
        FormListDto Form { get; set; }
    }
}
