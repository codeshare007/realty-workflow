using Microsoft.EntityFrameworkCore.Migrations;

namespace Realty.Migrations
{
    public partial class Updated_SubscribableEdition : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "DailyPrice",
                table: "AbpEditions",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "WeeklyPrice",
                table: "AbpEditions",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DailyPrice",
                table: "AbpEditions");

            migrationBuilder.DropColumn(
                name: "WeeklyPrice",
                table: "AbpEditions");
        }
    }
}
