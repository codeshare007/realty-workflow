import { AfterViewInit, Component, Injector, ViewChild } from '@angular/core';
import { SelectListItem } from '@app/admin/shared/general-combo.component';
import { FormsLibraryTableComponent } from '@app/shared/components/forms-library/forms-library-table/forms-library-table.component';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { LibraryFormServiceProxy, LibraryServiceProxy } from '@shared/service-proxies/service-proxies';
import { UploadDocumentModalComponent } from './modals/upload-local-move-photo/upload-document-modal.component';

@Component({
    templateUrl: './forms-library.component.html',
    animations: [accountModuleAnimation()],
})
export class FormsLibraryComponent extends AppComponentBase implements AfterViewInit {

    @ViewChild('uploadDocumentRef', { static: true }) uploadDocumentModal: UploadDocumentModalComponent;
    @ViewChild('formLibraryTable', { static: true }) table : FormsLibraryTableComponent;
    
    selectedLibrary: string;
    libraries: SelectListItem[];

    constructor(
        injector: Injector,
        private _libraryService: LibraryServiceProxy,
        private _libraryFormService: LibraryFormServiceProxy
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {
        this._getLibraries();
    }

    public openModal(): void {
        this.uploadDocumentModal.show();
    }

    public onModalSave(event: boolean): void {
        this.table.getListings();
    }

    private _getLibraries(): void {
        this._libraryService.getAll(undefined, undefined, 100, 0)
            .subscribe(result => {
                this.libraries = result.items.map(i => new SelectListItem(i.id, i.name));
                if (result.items.length) {
                    this.selectedLibrary = result.items[0].id;
                } else {
                    this.selectedLibrary = undefined;
                }
            });
    }
}
