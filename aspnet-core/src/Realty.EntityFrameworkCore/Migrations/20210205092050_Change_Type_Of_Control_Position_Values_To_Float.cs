using Microsoft.EntityFrameworkCore.Migrations;

namespace Realty.Migrations
{
    public partial class Change_Type_Of_Control_Position_Values_To_Float : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<float>(
                name: "Size_Width",
                table: "Controls",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<float>(
                name: "Size_Height",
                table: "Controls",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<float>(
                name: "Position_Top",
                table: "Controls",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<float>(
                name: "Position_Left",
                table: "Controls",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "Size_Width",
                table: "Controls",
                type: "int",
                nullable: true,
                oldClrType: typeof(float),
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Size_Height",
                table: "Controls",
                type: "int",
                nullable: true,
                oldClrType: typeof(float),
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Position_Top",
                table: "Controls",
                type: "int",
                nullable: true,
                oldClrType: typeof(float),
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Position_Left",
                table: "Controls",
                type: "int",
                nullable: true,
                oldClrType: typeof(float),
                oldNullable: true);
        }
    }
}
