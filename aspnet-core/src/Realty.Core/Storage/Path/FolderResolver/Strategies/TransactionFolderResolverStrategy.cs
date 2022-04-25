using Realty.Transactions;

namespace Realty.Storage.Path.FolderResolver.Strategies
{
    public class TransactionFolderResolverStrategy: IFolderResolverStrategy
    {
        private Transaction _transaction;

        public bool IsApplied(IHaveFiles parent)
        {
            if (!(parent is Transaction transaction)) return false;
            _transaction = transaction;
            return true;
        }

        public string GetPath() => $"Transactions/{_transaction.Id}";
    }
}
