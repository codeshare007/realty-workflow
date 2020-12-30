using System.Linq;
using Microsoft.EntityFrameworkCore;
using Realty.EntityFrameworkCore;
using Realty.Libraries;

namespace Realty.Migrations.Seed.Tenants
{
    public class DefaultLibraryBuilder
    {
        private readonly RealtyDbContext _context;

        public DefaultLibraryBuilder(RealtyDbContext context)
        {
            _context = context;
        }

        public void Create()
        {
            CreateDefaultLibrary();
        }

        private void CreateDefaultLibrary()
        {
            var tenants = _context.Tenants.IgnoreQueryFilters().ToList();
            foreach (var tenant in tenants)
            {
                var defaultLibrary = _context.Libraries
                    .IgnoreQueryFilters()
                    .FirstOrDefault(t => t.Name == Constants.DefaultName && t.TenantId == tenant.Id);

                if (defaultLibrary != null) continue;

                defaultLibrary = new Library(Constants.DefaultName)
                {
                    TenantId = tenant.Id
                };
                    
                _context.Libraries.Add(defaultLibrary);
                _context.SaveChanges();
            }
        }
    }
}
