using Realty.Editions.Dto;

namespace Realty.MultiTenancy.Payments.Dto
{
    public class PaymentInfoDto
    {
        public EditionSelectDto Edition { get; set; }

        public decimal AdditionalPrice { get; set; }

        public bool IsLessThanMinimumUpgradePaymentAmount()
        {
            return AdditionalPrice < RealtyConsts.MinimumUpgradePaymentAmount;
        }
    }
}
