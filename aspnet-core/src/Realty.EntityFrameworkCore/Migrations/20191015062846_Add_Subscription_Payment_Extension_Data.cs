using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Realty.Migrations
{
    public partial class Add_Subscription_Payment_Extension_Data : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppSubscriptionPaymentsExtensionData",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    SubscriptionPaymentId = table.Column<long>(nullable: false),
                    Key = table.Column<string>(nullable: true),
                    Value = table.Column<string>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppSubscriptionPaymentsExtensionData", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppSubscriptionPaymentsExtensionData_SubscriptionPaymentId_Key_IsDeleted",
                table: "AppSubscriptionPaymentsExtensionData",
                columns: new[] { "SubscriptionPaymentId", "Key", "IsDeleted" },
                unique: true,
                filter: "[Key] IS NOT NULL");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppSubscriptionPaymentsExtensionData");
        }
    }
}
