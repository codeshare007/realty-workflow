namespace Realty.Contacts.Input
{
    public abstract class AddressInput
    {
        public string StreetNumber { get; set; }
        public string StreetName { get; set; }
        public string UnitNumber { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
    }
}
