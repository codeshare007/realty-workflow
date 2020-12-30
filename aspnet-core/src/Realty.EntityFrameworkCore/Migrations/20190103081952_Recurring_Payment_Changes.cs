using Microsoft.EntityFrameworkCore.Migrations;

namespace Realty.Migrations
{
    public partial class Recurring_Payment_Changes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppSubscriptionPayments_PaymentId_Gateway",
                table: "AppSubscriptionPayments");

            migrationBuilder.RenameColumn(
                name: "PaymentId",
                table: "AppSubscriptionPayments",
                newName: "SuccessUrl");

            migrationBuilder.AlterColumn<string>(
                name: "SuccessUrl",
                table: "AppSubscriptionPayments",
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "AppSubscriptionPayments",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ErrorUrl",
                table: "AppSubscriptionPayments",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ExternalPaymentId",
                table: "AppSubscriptionPayments",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsRecurring",
                table: "AppSubscriptionPayments",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "SubscriptionPaymentType",
                table: "AbpTenants",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_AppSubscriptionPayments_ExternalPaymentId_Gateway",
                table: "AppSubscriptionPayments",
                columns: new[] { "ExternalPaymentId", "Gateway" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppSubscriptionPayments_ExternalPaymentId_Gateway",
                table: "AppSubscriptionPayments");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "AppSubscriptionPayments");

            migrationBuilder.DropColumn(
                name: "ErrorUrl",
                table: "AppSubscriptionPayments");

            migrationBuilder.DropColumn(
                name: "ExternalPaymentId",
                table: "AppSubscriptionPayments");

            migrationBuilder.DropColumn(
                name: "IsRecurring",
                table: "AppSubscriptionPayments");

            migrationBuilder.DropColumn(
                name: "SubscriptionPaymentType",
                table: "AbpTenants");

            migrationBuilder.RenameColumn(
                name: "SuccessUrl",
                table: "AppSubscriptionPayments",
                newName: "PaymentId");

            migrationBuilder.AlterColumn<string>(
                name: "PaymentId",
                table: "AppSubscriptionPayments",
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppSubscriptionPayments_PaymentId_Gateway",
                table: "AppSubscriptionPayments",
                columns: new[] { "PaymentId", "Gateway" });
        }
    }
}
