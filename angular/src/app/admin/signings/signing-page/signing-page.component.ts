import { Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbItem } from '@app/shared/common/sub-header/sub-header.component';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { SigningEditDto, SigningServiceProxy } from '@shared/service-proxies/service-proxies';
import { filter } from 'rxjs/internal/operators/filter';
import { map } from 'rxjs/internal/operators/map';
import { takeUntil } from 'rxjs/operators';

@Component({
    templateUrl: './signing-page.component.html',
    styleUrls: ['./signing-page.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [accountModuleAnimation()]
})
export class SigningPageComponent extends AppComponentBase implements OnInit {
    signing: SigningEditDto;
    transactionId: string;
    isEditMode = false;

    breadcrumbs: BreadcrumbItem[];

    accordionOptions = {
        participantsOpened: true,
        documentsOpened: true,
    }

    constructor(
        injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _signingService: SigningServiceProxy,
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
            this._signingService.getForEdit(id).subscribe(result => {
                this.signing = result;

                let breadcrumbsItems = new Array();

                if (this.signing.transactionId) {
                    breadcrumbsItems.push(
                        new BreadcrumbItem('Transaction: ' + this.signing.transaction,
                                           'app/admin/transactions/' + this.signing.transactionId + '/signings'));
                }

                breadcrumbsItems.push(
                    new BreadcrumbItem('Signing: ' + this.signing.name));

                this.breadcrumbs = breadcrumbsItems;
            });
        });

        this._activatedRoute
            .params
            .pipe(
                map(data => data.transactionId),
                filter(transactionId => transactionId !== undefined)
            ).subscribe(transactionId => {
                this.transactionId = transactionId;
            });

        this._activatedRoute.data.pipe(
            map(data => data.isCreate),
            filter(isCreate => isCreate !== undefined),
            takeUntil(this.onDestroy$)
        ).subscribe(isCreate => {
            if (isCreate) {
                this.signing = new SigningEditDto({
                    name: '',
                    notes: '',
                    agent: '',
                    agentId: '',
                    transaction: '',
                    transactionId: this.transactionId,
                    documentsCount: 0,
                    id: undefined,
                });

                if (this.transactionId) {
                    this.breadcrumbs = [
                        new BreadcrumbItem('Transaction',
                                           'app/admin/transactions/' + this.signing.transactionId + '/signings')];
                }

                this.isEditMode = true;
            }
        });
    }
}
