using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Realty.Migrations
{
    public partial class Add_Fields_to_RecommendedListing : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "RequestedTourDate",
                table: "RecommendedListing",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<DateTime>(
                name: "LastViewDate",
                table: "RecommendedListing",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddColumn<int>(
                name: "RequestedTourTime",
                table: "RecommendedListing",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RequestedTourTime",
                table: "RecommendedListing");

            migrationBuilder.AlterColumn<DateTime>(
                name: "RequestedTourDate",
                table: "RecommendedListing",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "LastViewDate",
                table: "RecommendedListing",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldNullable: true);
        }
    }
}
