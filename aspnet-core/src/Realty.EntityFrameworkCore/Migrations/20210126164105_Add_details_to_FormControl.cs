using Microsoft.EntityFrameworkCore.Migrations;

namespace Realty.Migrations
{
    public partial class Add_details_to_FormControl : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Label",
                table: "Controls");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Controls",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsProtected",
                table: "Controls",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsRequired",
                table: "Controls",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Placeholder",
                table: "Controls",
                maxLength: 256,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "Controls",
                maxLength: 256,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "Controls");

            migrationBuilder.DropColumn(
                name: "IsProtected",
                table: "Controls");

            migrationBuilder.DropColumn(
                name: "IsRequired",
                table: "Controls");

            migrationBuilder.DropColumn(
                name: "Placeholder",
                table: "Controls");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "Controls");

            migrationBuilder.AddColumn<string>(
                name: "Label",
                table: "Controls",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: true);
        }
    }
}
