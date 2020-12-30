using System;
using Realty.Common;

namespace Realty.Storage
{
    public interface IFilePathResolver: IDomainStrategy
    {
        bool IsApplied(Type type);

        string GetPath(int tenantId, Type type);
    }
}
