using Realty.EntityFrameworkCore;

namespace Realty.Test.Base.TestData
{
    public class TestDataBuilder
    {
        private readonly RealtyDbContext _context;
        private readonly int _tenantId;

        public TestDataBuilder(RealtyDbContext context, int tenantId)
        {
            _context = context;
            _tenantId = tenantId;
        }

        public void Create()
        {
            new TestOrganizationUnitsBuilder(_context, _tenantId).Create();
            new TestSubscriptionPaymentBuilder(_context, _tenantId).Create();
            new TestEditionsBuilder(_context).Create();

            _context.SaveChanges();
        }
    }
}
