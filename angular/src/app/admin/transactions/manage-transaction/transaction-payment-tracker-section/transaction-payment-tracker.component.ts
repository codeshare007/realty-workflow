import { Component, Injector, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PaymentParticipantType, TransactionPaymentTrackerDto, TransactionPaymentTrackerServiceProxy, UpdateTransactionPaymentTrackerInput } from '@shared/service-proxies/service-proxies';
import { isNumber } from 'lodash';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'transaction-payment-tracker',
    templateUrl: './transaction-payment-tracker.component.html',
})
export class TransactionPaymentTrackerComponent extends AppComponentBase implements OnInit {

    @Input() transactionId: string;

    saveChangesSubject = new Subject();
    transactionPaymentTracker: TransactionPaymentTrackerDto;
    paymentParticipantType = PaymentParticipantType;

    constructor(
        injector: Injector,
        private _transactionPaymentTrackerService: TransactionPaymentTrackerServiceProxy,
        private _router: Router,
    ) {
        super(injector);
    }

    get totalOfficeFeeEarned(): number {
        return this.transactionPaymentTracker.feePayment
            - ((this.dueFromTenant - this.transactionPaymentTracker.receivedFromTenant)
                + (this.dueFromLandlord - (this.transactionPaymentTracker.receivedFromLandlord + (this.transactionPaymentTracker.isWithholdingFee ? this.landlordFee : 0))))
            ;
    }

    get dueFromTenant(): number {
        return this.transactionPaymentTracker.firstPayment +
            this.transactionPaymentTracker.lastPayment +
            this.transactionPaymentTracker.securityPayment +
            this.transactionPaymentTracker.keyPayment +
            this.transactionPaymentTracker.otherPayment +
            this.tenantFee +
            this.transactionPaymentTracker.totalAddedFees;
    }

    get dueFromLandlord(): number {
        return this.landlordFee;
    }

    get dueLandlord(): number {
        let value = this.transactionPaymentTracker.firstPayment +
            this.transactionPaymentTracker.lastPayment +
            this.transactionPaymentTracker.securityPayment +
            this.transactionPaymentTracker.keyPayment +
            this.transactionPaymentTracker.otherPayment;

        if (this.transactionPaymentTracker.isWithholdingFee) {
            value = value - this.landlordFee;
        }

        return value;
    }

    get tenantFee() {
        return this.transactionPaymentTracker.feePayment * this.transactionPaymentTracker.tenantFeePercentage / 100;
    }

    get landlordFee() {
        return this.transactionPaymentTracker.feePayment * this.transactionPaymentTracker.landlordFeePercentage / 100;
    }

    ngOnInit(): void {
        this.getTransactionPaymentTracker();

        this.saveChangesSubject.pipe(takeUntil(this.onDestroy$), debounceTime(2000))
            .subscribe(() => {
                this.save();
            });
    }

    getTransactionPaymentTracker() {
        this._transactionPaymentTrackerService
            .get(this.transactionId)
            .subscribe(transactionPaymentTracker => this.transactionPaymentTracker = transactionPaymentTracker);
    }

    saveChanges() {
        this.saveChangesSubject.next();
    }

    save() {
        let input = new UpdateTransactionPaymentTrackerInput(this.transactionPaymentTracker);
        input.id = this.transactionId;

        this._transactionPaymentTrackerService
            .update(input)
            .subscribe(() => {
                this.notify.success(this.l('SuccessfullySaved'));
            });
    }

    getTotalMoneyOnDeal(transactionPaymentTracker: TransactionPaymentTrackerDto) {
        return (isNumber(transactionPaymentTracker.firstPayment) ? transactionPaymentTracker.firstPayment : 0)
            + (isNumber(transactionPaymentTracker.lastPayment) ? transactionPaymentTracker.lastPayment : 0)
            + (isNumber(transactionPaymentTracker.securityPayment) ? transactionPaymentTracker.securityPayment : 0)
            + (isNumber(transactionPaymentTracker.keyPayment) ? transactionPaymentTracker.keyPayment : 0)
            + (isNumber(transactionPaymentTracker.otherPayment) ? transactionPaymentTracker.otherPayment : 0)
            + (isNumber(transactionPaymentTracker.feePayment) ? transactionPaymentTracker.feePayment : 0);
    }
}
