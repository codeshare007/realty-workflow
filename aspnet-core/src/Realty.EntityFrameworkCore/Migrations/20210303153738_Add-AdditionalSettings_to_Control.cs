using Microsoft.EntityFrameworkCore.Migrations;

namespace Realty.Migrations
{
    public partial class AddAdditionalSettings_to_Control : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AdditionalSettings",
                table: "Controls",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AdditionalSettings",
                table: "Controls");
        }
    }
}
