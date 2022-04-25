import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SelectListItem } from '@app/admin/shared/general-combo-string.component';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateTransactionInput, TransactionEditDto, TransactionServiceProxy, TransactionStatus, TransactionType, UpdateTransactionInput, UserSearchDto } from '@shared/service-proxies/service-proxies';

@Component({
    selector: 'transaction-general-info-section',
    templateUrl: './transaction-general-info-section.component.html',
    styleUrls: ['./transaction-general-info-section.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [accountModuleAnimation()]
})
export class TransactionGeneralSectionComponent extends AppComponentBase implements OnInit, OnChanges {
    @Input() transaction: TransactionEditDto;
    @Output() transactionChange = new EventEmitter<TransactionEditDto>();
    @Input() isEditMode: boolean;
    @Output() isEditModeChange = new EventEmitter<boolean>();
    @Output() save = new EventEmitter<boolean>();
    isOpened = true;

    agent: UserSearchDto;
    customer: UserSearchDto;
    statusValues = [
        new SelectListItem(TransactionStatus.Open, 'Open'),
        new SelectListItem(TransactionStatus.Active, 'Active'),
        new SelectListItem(TransactionStatus.Pending, 'Pending'),
        new SelectListItem(TransactionStatus.Expired, 'Expired'),
        new SelectListItem(TransactionStatus.Withdrawn, 'Withdrawn'),
        new SelectListItem(TransactionStatus.ClosedFileComplete, 'Closed File Complete'),
        new SelectListItem(TransactionStatus.Closed, 'Closed'),
    ];
    typeValues = [
        new SelectListItem(TransactionType.None, 'None'),
        new SelectListItem(TransactionType.ResidentialLease, 'Residential Lease'),
        new SelectListItem(TransactionType.ResidentialListing, 'Residential Listing'),
        new SelectListItem(TransactionType.ResidentialSale, 'Residential Sale'),
        new SelectListItem(TransactionType.Renewal, 'Renewal')
    ];

    constructor(
        injector: Injector,
        private _transactionService: TransactionServiceProxy,
        private _router: Router,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.initUsers();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.initUsers();
    }

    initUsers() {
        if (this.transaction !== undefined) {
            if (this.agent === undefined && this.transaction.agentId) {
                this.agent = new UserSearchDto({
                    name: this.transaction.agent,
                    publicId: this.transaction.agentId
                });
            }

            if (this.customer === undefined && this.transaction.customerId) {
                this.customer = new UserSearchDto({
                    name: this.transaction.customer,
                    publicId: this.transaction.customerId
                });
            }
        }
    }

    getStatusDescription(status: TransactionStatus) {
        switch(status) {
            case TransactionStatus.Open: return 'Open';
            case TransactionStatus.Active: return 'Active';
            case TransactionStatus.Pending: return 'Pending';
            case TransactionStatus.Expired: return 'Expired';
            case TransactionStatus.Withdrawn: return 'Withdrawn';
            case TransactionStatus.ClosedFileComplete: return 'Closed File Complete';
            case TransactionStatus.Closed: return 'Closed';
            default: return '';
        }
    }

    getTypeDescription(status: TransactionType) {
        switch(status) {
            case TransactionType.None: return 'None';
            case TransactionType.ResidentialLease: return 'Residential Lease';
            case TransactionType.ResidentialListing: return 'Residential Listing';
            case TransactionType.ResidentialSale: return 'Residential Sale';
            default: return '';
        }
    }

    saveTransaction() {
        if (this.transaction.id) {
            let input = new UpdateTransactionInput();
            input.transaction = this.transaction;

            this._transactionService.update(input).subscribe(id => {
                this.isEditMode = false;
            });

        } else {
            let input = CreateTransactionInput.fromJS(this.transaction);

            this._transactionService.create(input).subscribe(id => {
                this.isEditMode = false;
                this._router.navigate(['app/admin/transactions', id]);
            });
        }
    }
}
