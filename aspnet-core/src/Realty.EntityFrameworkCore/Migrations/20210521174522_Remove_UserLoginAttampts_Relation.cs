using Microsoft.EntityFrameworkCore.Migrations;

namespace Realty.Migrations
{
    public partial class Remove_UserLoginAttampts_Relation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AbpUserLoginAttempts_AbpUsers_UserId",
                table: "AbpUserLoginAttempts");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddForeignKey(
                name: "FK_AbpUserLoginAttempts_AbpUsers_UserId",
                table: "AbpUserLoginAttempts",
                column: "UserId",
                principalTable: "AbpUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
