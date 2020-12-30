using Realty.EntityFrameworkCore;

namespace Realty.Migrations.Seed.Host
{
    public class InitialHostDbBuilder
    {
        private readonly RealtyDbContext _context;

        public InitialHostDbBuilder(RealtyDbContext context)
        {
            _context = context;
        }

        public void Create()
        {
            new DefaultEditionCreator(_context).Create();
            new DefaultLanguagesCreator(_context).Create();
            new HostRoleAndUserCreator(_context).Create();
            new DefaultSettingsCreator(_context).Create();

            _context.SaveChanges();
        }
    }
}
