using System;
using System.Collections.Generic;
using System.Linq;

namespace Realty.Reflection
{
    public static class AppDomainExtension
    {
        public static IEnumerable<Type> GetLoadableTypes(this AppDomain appDomain)
        {
            return AppDomain.CurrentDomain.GetAssemblies().SelectMany(a => a.GetLoadableTypes());
        }
    }
}
