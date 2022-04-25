using Microsoft.EntityFrameworkCore.Migrations;

namespace Realty.Migrations
{
    public partial class Extend_Listing : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "HeatSource",
                table: "Listings",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StudentPolicy",
                table: "Listings",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HeatSource",
                table: "Listings");

            migrationBuilder.DropColumn(
                name: "StudentPolicy",
                table: "Listings");
        }
    }
}
