import { Component, EventEmitter, Injector, Input, Output, ViewChild } from '@angular/core';
import { SelectListItem } from '@app/admin/shared/general-combo-string.component';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreatePaymentInput, GatewayType, PaymentParticipantType, PaymentStatus, TransactionParticipantServiceProxy, TransactionPaymentDto, TransactionPaymentServiceProxy, UpdatePaymentInput } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'create-edit-payment-modal',
    templateUrl: './create-edit-payment-modal.component.html',
    styleUrls: ['create-edit-payment-modal.component.less']
})
export class CreateEditPaymentModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<string> = new EventEmitter<string>();

    @Input() participantType: PaymentParticipantType;
    @Input() transactionId: string;

    active = false;
    saving = false;
    payment: TransactionPaymentDto;
    participants: SelectListItem[];
    checkGatewayType = GatewayType.Check;
    gatewayTypes = [
        new SelectListItem(GatewayType.Unknown, 'Unknown'),
        new SelectListItem(GatewayType.Cash, 'Cash'),
        new SelectListItem(GatewayType.Check, 'Check'),
        new SelectListItem(GatewayType.Quickbook, 'Quickbook'),
        new SelectListItem(GatewayType.Stripe, 'Stripe')
    ];
    paymentStatusTypes = [
        new SelectListItem(PaymentStatus.Pending, 'Pending'),
        new SelectListItem(PaymentStatus.Paid, 'Paid')
    ];

    constructor(
        injector: Injector,
        private _transactionPaymentService: TransactionPaymentServiceProxy,
        private _transactionParticipantService: TransactionParticipantServiceProxy,
    ) {
        super(injector);
    }

    show(paymentId: string): void {
        if (paymentId !== undefined) {
            this._transactionPaymentService
            .getPayment(paymentId, this.transactionId)
            .subscribe(payment => {
                this.payment = payment;

                this.active = true;
                this.modal.show();
            });
        } else {
            this.payment = new TransactionPaymentDto();
            this.active = true;
            this.modal.show();
        }

        this._transactionParticipantService
            .getAll(undefined, this.transactionId, undefined, 1000, 0)
            .subscribe(result => {
                this.participants = result.items.map(p => new SelectListItem(p.id, p.firstName + ' ' + p.lastName));
            });
    }

    onShown(): void {
        document.getElementById('PaymentAmount').focus();
    }

    save(): void {
        if (this.payment.id === undefined) {
            let input = new CreatePaymentInput({
                participantType: this.participantType,
                gateway: this.payment.gateway,
                status: this.payment.status,
                participantId: this.payment.participantId,
                checkNumber: this.payment.checkNumber,
                amount: this.payment.amount,
                paymentDate: this.payment.paymentDate,
                comment: this.payment.comment,
                bounced: this.payment.bounced,
                transactionId: this.transactionId
            });

            this._transactionPaymentService
            .createPayment(input)
            .subscribe(paymentId => {
                this.modalSave.emit(paymentId);
                this.close();
            });
        } else if (this.payment.id !== undefined) {
            let input = new UpdatePaymentInput({
                id: this.payment.id,
                gateway: this.payment.gateway,
                status: this.payment.status,
                participantId: this.payment.participantId,
                checkNumber: this.payment.checkNumber,
                amount: this.payment.amount,
                paymentDate: this.payment.paymentDate,
                comment: this.payment.comment,
                bounced: this.payment.bounced,
                transactionId: this.transactionId
            });

            this._transactionPaymentService
            .updatePayment(input)
            .subscribe(paymentId => {
                this.modalSave.emit(paymentId);
                this.close();
            });
        }
    }

    close(): void {
        this.active = false;
        this.payment = null;
        this.modal.hide();
    }
}
