import { Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbItem } from '@app/shared/common/sub-header/sub-header.component';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TransactionEditDto, TransactionServiceProxy, TransactionStatus, TransactionType } from '@shared/service-proxies/service-proxies';
import { filter } from 'rxjs/internal/operators/filter';
import { map } from 'rxjs/internal/operators/map';
import { takeUntil } from 'rxjs/operators';

@Component({
    templateUrl: './manage-transaction.component.html',
    styleUrls: ['./manage-transaction.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [accountModuleAnimation()]
})
export class ManageTransactionComponent extends AppComponentBase implements OnInit {
    transaction: TransactionEditDto;
    isEditMode = false;

    transactionSections = {
        contacts: 'contacts',
        forms: 'forms',
        signings: 'signings',
        documents: 'documents'
    };
    breadcrumbs: BreadcrumbItem[];

    currentSection = this.transactionSections.contacts;

    constructor(
        injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _transactionService: TransactionServiceProxy,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this._activatedRoute
        .params
        .pipe(
            map(data => data.id),
            filter(id => id !== undefined)
        ).subscribe(id => {
            this._transactionService.getForEdit(id).subscribe(result => {
                this.transaction = result;

                this.breadcrumbs = [
                    new BreadcrumbItem(this.transaction.name),
                ];
            });
        });

        this._activatedRoute
            .params
            .pipe(
                map(data => data.section),
                filter(section => section !== undefined)
            ).subscribe(section => {
                this.switchSection(section);
            });

        this._activatedRoute.data.pipe(
            map(data => data.isCreate),
            filter(isCreate => isCreate !== undefined),
            takeUntil(this.onDestroy$)
        ).subscribe(isCreate => {
            if (isCreate) {
                this.transaction = new TransactionEditDto({
                    name: '',
                    status: TransactionStatus.Open,
                    type: TransactionType.None,
                    notes: '',
                    customer: '',
                    agent: '',
                    listingCode: '',
                    leadCode: '',
                    customerId: '',
                    agentId: '',
                    leadId: '',
                    listingId: '',
                    id: undefined,
                });
                this.isEditMode = true;
            }
        });
    }

    switchSection(section: string) {
        this.currentSection = this.transactionSections.contacts;

        if (!!section) {
            section = section.toLowerCase();

            Object.keys(this.transactionSections).forEach(key => {
                if (this.transactionSections[key] === section) {
                    this.currentSection = this.transactionSections[key];
                }
              });
        }
    }
}
