using Microsoft.EntityFrameworkCore.Migrations;

namespace Realty.Migrations
{
    public partial class Add_Control_TextPosition : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TextPosition",
                table: "Controls",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddForeignKey(
                name: "FK_AbpUserLoginAttempts_AbpUsers_UserId",
                table: "AbpUserLoginAttempts",
                column: "UserId",
                principalTable: "AbpUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AbpUserLoginAttempts_AbpUsers_UserId",
                table: "AbpUserLoginAttempts");

            migrationBuilder.DropColumn(
                name: "TextPosition",
                table: "Controls");
        }
    }
}
