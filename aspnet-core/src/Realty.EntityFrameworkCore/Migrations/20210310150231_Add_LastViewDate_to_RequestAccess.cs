using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Realty.Migrations
{
    public partial class Add_LastViewDate_to_RequestAccess : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LastViewDate",
                table: "ViewRequests",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastViewDate",
                table: "SigningRequests",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastViewDate",
                table: "ViewRequests");

            migrationBuilder.DropColumn(
                name: "LastViewDate",
                table: "SigningRequests");
        }
    }
}
