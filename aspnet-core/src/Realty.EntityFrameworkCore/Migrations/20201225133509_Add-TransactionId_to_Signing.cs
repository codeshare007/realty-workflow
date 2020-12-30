using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Realty.Migrations
{
    public partial class AddTransactionId_to_Signing : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "TransactionId",
                table: "Signings",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Signings_TransactionId",
                table: "Signings",
                column: "TransactionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Signings_Transactions_TransactionId",
                table: "Signings",
                column: "TransactionId",
                principalTable: "Transactions",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Signings_Transactions_TransactionId",
                table: "Signings");

            migrationBuilder.DropIndex(
                name: "IX_Signings_TransactionId",
                table: "Signings");

            migrationBuilder.DropColumn(
                name: "TransactionId",
                table: "Signings");
        }
    }
}
