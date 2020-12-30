using Microsoft.EntityFrameworkCore.Migrations;

namespace Realty.Migrations
{
    public partial class Add_SenderName_ToName_To_CommunicationMessages : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SenderName",
                table: "CommunicationMessages",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ToName",
                table: "CommunicationMessages",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SenderName",
                table: "CommunicationMessages");

            migrationBuilder.DropColumn(
                name: "ToName",
                table: "CommunicationMessages");
        }
    }
}
