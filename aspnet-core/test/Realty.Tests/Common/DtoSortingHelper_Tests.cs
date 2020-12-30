using Realty.Common;
using Shouldly;
using Xunit;

namespace Realty.Tests.Common
{
    public class DtoSortingHelper_Tests
    {
        [Fact]
        public void ReplaceSorting_Test()
        {
            var sorting = "UserName desc, Age asc";

            DtoSortingHelper.ReplaceSorting(sorting, s =>
            {
                if (s == "UserName desc")
                {
                    s = "username desc";
                }

                if (s == "Age asc")
                {
                    s = "age asc";
                }

                return s;
            }).ShouldBe("username desc,age asc");

            sorting = "UserName desc";

            DtoSortingHelper.ReplaceSorting(sorting, s =>
            {
                if (s == "UserName desc")
                {
                    s = "username desc";
                }
                return s;
            }).ShouldBe("username desc");
        }
    }
}
