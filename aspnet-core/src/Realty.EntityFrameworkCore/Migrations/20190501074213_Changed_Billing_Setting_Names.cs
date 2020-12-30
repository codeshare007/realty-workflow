using Microsoft.EntityFrameworkCore.Migrations;

namespace Realty.Migrations
{
    public partial class Changed_Billing_Setting_Names : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("UPDATE AbpSettings SET Name = 'App.TenantManagement.BillingLegalName' WHERE Name = 'App.UserManagement.BillingLegalName'");
            migrationBuilder.Sql("UPDATE AbpSettings SET Name = 'App.TenantManagement.BillingAddress' WHERE Name = 'App.UserManagement.BillingAddress'");
            migrationBuilder.Sql("UPDATE AbpSettings SET Name = 'App.TenantManagement.BillingTaxVatNo' WHERE Name = 'App.UserManagement.BillingTaxVatNo'");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("UPDATE AbpSettings SET Name = 'App.UserManagement.BillingLegalName' WHERE Name = 'App.TenantManagement.BillingLegalName'");
            migrationBuilder.Sql("UPDATE AbpSettings SET Name = 'App.UserManagement.BillingAddress' WHERE Name = 'App.TenantManagement.BillingAddress'");
            migrationBuilder.Sql("UPDATE AbpSettings SET Name = 'App.UserManagement.BillingTaxVatNo' WHERE Name = 'App.TenantManagement.BillingTaxVatNo'");
        }
    }
}
