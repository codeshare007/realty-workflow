namespace Realty.TransactionPaymentTrackers
{
    public enum GatewayType
    {
        Unknown = 0,
        Cash = 1,
        Check = 2,
        Stripe = 3,
        Quickbook = 4
    }

    public enum PaymentStatus
    {
        Pending = 0,
        Paid = 1
    }

    public enum PaymentParticipantType
    {
        Unknown = 0,
        FromClient = 1,
        FromLandlord = 2,
        ToLandlord = 3,
        ToAgent = 4
    }
}
