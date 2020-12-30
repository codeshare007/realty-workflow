using Abp.Organizations;
using Realty.EntityFrameworkCore;

namespace Realty.Test.Base.TestData
{
    /* Creates OU tree for default tenant as shown below:
     * 
     * - OU1
     *   - OU11
     *     - OU111
     *     - OU112
     *   - OU12
     * - OU2
     *   - OU21
     */
    public class TestOrganizationUnitsBuilder
    {
        private readonly RealtyDbContext _context;
        private readonly int _tenantId;

        public TestOrganizationUnitsBuilder(RealtyDbContext context, int tenantId)
        {
            _context = context;
            _tenantId = tenantId;
        }

        public void Create()
        {
            CreateOrganizationUnits();
        }

        private void CreateOrganizationUnits()
        {
            var ou1 = CreateOrganizationUnit("OU1", OrganizationUnit.CreateCode(1));
            var ou11 = CreateOrganizationUnit("OU11", OrganizationUnit.CreateCode(1, 1), ou1.Id);
            var ou111 = CreateOrganizationUnit("OU111", OrganizationUnit.CreateCode(1, 1, 1), ou11.Id);
            var ou112 = CreateOrganizationUnit("OU112", OrganizationUnit.CreateCode(1, 1, 2), ou11.Id);
            var ou12 = CreateOrganizationUnit("OU12", OrganizationUnit.CreateCode(1, 2), ou1.Id);
            var ou2 = CreateOrganizationUnit("OU2", OrganizationUnit.CreateCode(2));
            var ou21 = CreateOrganizationUnit("OU21", OrganizationUnit.CreateCode(2, 1), ou2.Id);
        }

        private OrganizationUnit CreateOrganizationUnit(string displayName, string code, long? parentId = null)
        {
            var organizationUnit = _context.OrganizationUnits.Add(new OrganizationUnit(_tenantId, displayName, parentId)
            {
                Code = code
            }).Entity;

            _context.SaveChanges();

            return organizationUnit;
        }
    }
}
