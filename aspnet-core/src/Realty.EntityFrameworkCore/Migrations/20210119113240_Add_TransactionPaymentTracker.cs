using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Realty.Migrations
{
    public partial class Add_TransactionPaymentTracker : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "PaymentTrackerId",
                table: "Transactions",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "TransactionPaymentTrackers",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    CreationTime = table.Column<DateTime>(nullable: false),
                    CreatorUserId = table.Column<long>(nullable: true),
                    LastModificationTime = table.Column<DateTime>(nullable: true),
                    LastModifierUserId = table.Column<long>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    DeleterUserId = table.Column<long>(nullable: true),
                    DeletionTime = table.Column<DateTime>(nullable: true),
                    FirstPayment = table.Column<decimal>(nullable: false),
                    LastPayment = table.Column<decimal>(nullable: false),
                    SecurityPayment = table.Column<decimal>(nullable: false),
                    KeyPayment = table.Column<decimal>(nullable: false),
                    OtherPayment = table.Column<decimal>(nullable: false),
                    FeePayment = table.Column<decimal>(nullable: false),
                    TenantFeePercentage = table.Column<decimal>(nullable: false),
                    LandlordFeePercentage = table.Column<decimal>(nullable: false),
                    IsWithholdingFee = table.Column<bool>(nullable: false),
                    TenantId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TransactionPaymentTrackers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TransactionPaymentTrackers_AbpTenants_TenantId",
                        column: x => x.TenantId,
                        principalTable: "AbpTenants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Payments",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    CreationTime = table.Column<DateTime>(nullable: false),
                    CreatorUserId = table.Column<long>(nullable: true),
                    LastModificationTime = table.Column<DateTime>(nullable: true),
                    LastModifierUserId = table.Column<long>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    DeleterUserId = table.Column<long>(nullable: true),
                    DeletionTime = table.Column<DateTime>(nullable: true),
                    Gateway = table.Column<int>(nullable: false),
                    Status = table.Column<int>(nullable: false),
                    ParticipantType = table.Column<int>(nullable: false),
                    TransactionParticipantId = table.Column<Guid>(nullable: true),
                    CheckNumber = table.Column<string>(nullable: true),
                    Amount = table.Column<decimal>(nullable: false),
                    PaymentDate = table.Column<DateTime>(nullable: false),
                    Comment = table.Column<string>(nullable: true),
                    ExternalPaymentInfo = table.Column<string>(nullable: true),
                    Bounced = table.Column<decimal>(nullable: false),
                    TenantId = table.Column<int>(nullable: false),
                    TransactionPaymentTrackerId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Payments_AbpTenants_TenantId",
                        column: x => x.TenantId,
                        principalTable: "AbpTenants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Payments_TransactionPaymentTrackers_TransactionPaymentTrackerId",
                        column: x => x.TransactionPaymentTrackerId,
                        principalTable: "TransactionPaymentTrackers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "TransactionAdditionalFees",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    CreationTime = table.Column<DateTime>(nullable: false),
                    CreatorUserId = table.Column<long>(nullable: true),
                    LastModificationTime = table.Column<DateTime>(nullable: true),
                    LastModifierUserId = table.Column<long>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    DeleterUserId = table.Column<long>(nullable: true),
                    DeletionTime = table.Column<DateTime>(nullable: true),
                    Amount = table.Column<decimal>(nullable: false),
                    Comment = table.Column<string>(nullable: true),
                    TenantId = table.Column<int>(nullable: false),
                    TransactionPaymentTrackerId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TransactionAdditionalFees", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TransactionAdditionalFees_AbpTenants_TenantId",
                        column: x => x.TenantId,
                        principalTable: "AbpTenants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TransactionAdditionalFees_TransactionPaymentTrackers_TransactionPaymentTrackerId",
                        column: x => x.TransactionPaymentTrackerId,
                        principalTable: "TransactionPaymentTrackers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_PaymentTrackerId",
                table: "Transactions",
                column: "PaymentTrackerId");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_TenantId",
                table: "Payments",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_TransactionPaymentTrackerId",
                table: "Payments",
                column: "TransactionPaymentTrackerId");

            migrationBuilder.CreateIndex(
                name: "IX_TransactionAdditionalFees_TenantId",
                table: "TransactionAdditionalFees",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_TransactionAdditionalFees_TransactionPaymentTrackerId",
                table: "TransactionAdditionalFees",
                column: "TransactionPaymentTrackerId");

            migrationBuilder.CreateIndex(
                name: "IX_TransactionPaymentTrackers_TenantId",
                table: "TransactionPaymentTrackers",
                column: "TenantId");

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_TransactionPaymentTrackers_PaymentTrackerId",
                table: "Transactions",
                column: "PaymentTrackerId",
                principalTable: "TransactionPaymentTrackers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Controls_Contacts_ParticipantId",
                table: "Controls");

            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_TransactionPaymentTrackers_PaymentTrackerId",
                table: "Transactions");

            migrationBuilder.DropTable(
                name: "Payments");

            migrationBuilder.DropTable(
                name: "TransactionAdditionalFees");

            migrationBuilder.DropTable(
                name: "TransactionPaymentTrackers");

            migrationBuilder.DropIndex(
                name: "IX_Transactions_PaymentTrackerId",
                table: "Transactions");

            migrationBuilder.DropIndex(
                name: "IX_Controls_ParticipantId",
                table: "Controls");

            migrationBuilder.DropColumn(
                name: "PaymentTrackerId",
                table: "Transactions");

            migrationBuilder.AlterColumn<string>(
                name: "Value",
                table: "ControlValues",
                type: "nvarchar(2048)",
                maxLength: 2048,
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<long>(
                name: "ParticipantId",
                table: "Controls",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(Guid),
                oldNullable: true);
        }
    }
}
