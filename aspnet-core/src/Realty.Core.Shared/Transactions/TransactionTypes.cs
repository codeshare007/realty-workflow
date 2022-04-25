namespace Realty.Transactions
{
    public enum TransactionStatus
    {
        Active = 0,
        Closed = 1,
        ClosedFileComplete = 2,
        Expired = 3,
        Open = 4,
        Pending = 5,
        Withdrawn = 6
    }

    public enum TransactionType
    {
        None = 0,
        CommercialLease = 1,
        CommercialListing = 2,
        CommercialSale = 3,
        CondoLease = 4,
        CondoListing = 5,
        CondoSale = 6,
        ResidentialLease = 7,
        ResidentialListing = 8,
        ResidentialSale = 9,
        Renewal = 10
    }
}
