using Microsoft.EntityFrameworkCore.Migrations;

namespace Realty.Migrations
{
    public partial class Add_AgentFeePercentage_to_TransactionPaymentTracker : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<float>(
                name: "TenantFeePercentage",
                table: "TransactionPaymentTrackers",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<float>(
                name: "LandlordFeePercentage",
                table: "TransactionPaymentTrackers",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AddColumn<float>(
                name: "AgentFeePercentage",
                table: "TransactionPaymentTrackers",
                nullable: false,
                defaultValue: 0f);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AgentFeePercentage",
                table: "TransactionPaymentTrackers");

            migrationBuilder.AlterColumn<decimal>(
                name: "TenantFeePercentage",
                table: "TransactionPaymentTrackers",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(float));

            migrationBuilder.AlterColumn<decimal>(
                name: "LandlordFeePercentage",
                table: "TransactionPaymentTrackers",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(float));
        }
    }
}
