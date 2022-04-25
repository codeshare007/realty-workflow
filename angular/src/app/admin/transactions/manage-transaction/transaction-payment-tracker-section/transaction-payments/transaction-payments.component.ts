import { Component, EventEmitter, Injector, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ContactListDto, GatewayType, PaymentParticipantType, PaymentStatus, TransactionPaymentServiceProxy } from '@shared/service-proxies/service-proxies';
import { Table } from 'primeng';

@Component({
    selector: 'transaction-payments',
    templateUrl: './transaction-payments.component.html',
    animations: [accountModuleAnimation()]
})
export class TransactionPaymentsComponent extends AppComponentBase implements OnInit, OnDestroy {

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @Input() transactionId: string;
    @Input() participantType: PaymentParticipantType;
    @Output() updated = new EventEmitter<boolean>()

    active = false;
    saving = false;

    constructor(
        injector: Injector,
        private _transactionPaymentServiceProxy: TransactionPaymentServiceProxy,
    ) {
        super(injector);
    }

    ngOnInit(): void {

    }

    public getPayments(): void {
        this._transactionPaymentServiceProxy.getPayments(
            this.participantType,
            this.transactionId).subscribe(payments => {
                this.primengTableHelper.records = payments;
                this.primengTableHelper.totalRecordsCount = payments.length;
            });
    }

    public deletePayment(record: ContactListDto): void {
        this.message.confirm(
            this.l('DeleteWarningMessage'),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._transactionPaymentServiceProxy
                        .deletePayment(record.id, this.transactionId)
                        .subscribe((payment) => {
                            this.getPayments();
                            this.updated.emit(true);
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    public getPaymentStatusDescription(status: PaymentStatus): string {
        switch (status) {
            case PaymentStatus.Pending: return 'Pending';
            case PaymentStatus.Paid: return 'Paid';
            default: return '';
        }
    }

    public getGatewayTypeDescription(gateway: GatewayType): string {
        switch (gateway) {
            case GatewayType.Unknown: return 'Unknown';
            case GatewayType.Cash: return 'Cash';
            case GatewayType.Check: return 'Check';
            case GatewayType.Quickbook: return 'Quickbook';
            case GatewayType.Stripe: return 'Stripe';
            default: return '';
        }
    }
}
