import { Component, Injector, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { EditionListDto, EditionServiceProxy } from '@shared/service-proxies/service-proxies';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { CreateEditionModalComponent } from './create-edition-modal.component';
import { EditEditionModalComponent } from './edit-edition-modal.component';
import { MoveTenantsToAnotherEditionModalComponent } from './move-tenants-to-another-edition-modal.component';
import { finalize } from 'rxjs/operators';

@Component({
    templateUrl: './editions.component.html',
    animations: [appModuleAnimation()]
})
export class EditionsComponent extends AppComponentBase {

    @ViewChild('createEditionModal', {static: true}) createEditionModal: CreateEditionModalComponent;
    @ViewChild('editEditionModal', {static: true}) editEditionModal: EditEditionModalComponent;
    @ViewChild('moveTenantsToAnotherEditionModal', {static: true}) moveTenantsToAnotherEditionModal: MoveTenantsToAnotherEditionModalComponent;
    @ViewChild('dataTable', {static: true}) dataTable: Table;
    @ViewChild('paginator', {static: true}) paginator: Paginator;

    constructor(
        injector: Injector,
        private _editionService: EditionServiceProxy
    ) {
        super(injector);
    }

    getEditions(): void {
        this.primengTableHelper.showLoadingIndicator();
        this._editionService.getEditions()
            .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
            .subscribe(result => {
                this.primengTableHelper.totalRecordsCount = result.items.length;
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.hideLoadingIndicator();
            });
    }

    createEdition(): void {
        this.createEditionModal.show();
    }

    deleteEdition(edition: EditionListDto): void {
        this.message.confirm(
            this.l('EditionDeleteWarningMessage', edition.displayName),
            this.l('AreYouSure'),
            isConfirmed => {
                if (isConfirmed) {
                    this._editionService.deleteEdition(edition.id).subscribe(() => {
                        this.getEditions();
                        this.notify.success(this.l('SuccessfullyDeleted'));
                    });
                }
            }
        );
    }
}
