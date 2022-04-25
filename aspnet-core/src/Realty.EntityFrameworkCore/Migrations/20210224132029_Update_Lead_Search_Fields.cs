using Microsoft.EntityFrameworkCore.Migrations;

namespace Realty.Migrations
{
    public partial class Update_Lead_Search_Fields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Beds",
                table: "Leads");

            migrationBuilder.DropColumn(
                name: "MinBath",
                table: "Leads");

            migrationBuilder.AddColumn<string>(
                name: "Bathrooms",
                table: "Leads",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Bedrooms",
                table: "Leads",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StreetName",
                table: "Leads",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StreetNumber",
                table: "Leads",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Zip",
                table: "Leads",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Bathrooms",
                table: "Leads");

            migrationBuilder.DropColumn(
                name: "Bedrooms",
                table: "Leads");

            migrationBuilder.DropColumn(
                name: "StreetName",
                table: "Leads");

            migrationBuilder.DropColumn(
                name: "StreetNumber",
                table: "Leads");

            migrationBuilder.DropColumn(
                name: "Zip",
                table: "Leads");

            migrationBuilder.AddColumn<string>(
                name: "Beds",
                table: "Leads",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "MinBath",
                table: "Leads",
                type: "decimal(18,2)",
                nullable: true);
        }
    }
}
