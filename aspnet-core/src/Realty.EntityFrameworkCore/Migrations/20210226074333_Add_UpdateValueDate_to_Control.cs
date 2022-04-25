using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Realty.Migrations
{
    public partial class Add_UpdateValueDate_to_Control : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "IP",
                table: "ControlValues",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdateValueDate",
                table: "ControlValues",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IP",
                table: "ControlValues");

            migrationBuilder.DropColumn(
                name: "UpdateValueDate",
                table: "ControlValues");
        }
    }
}
