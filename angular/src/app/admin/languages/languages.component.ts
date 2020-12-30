import { Component, ElementRef, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ApplicationLanguageListDto, LanguageServiceProxy, SetDefaultLanguageInput } from '@shared/service-proxies/service-proxies';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { CreateOrEditLanguageModalComponent } from './create-or-edit-language-modal.component';
import { AbpSessionService } from 'abp-ng2-module';
import { finalize } from 'rxjs/operators';

@Component({
    templateUrl: './languages.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class LanguagesComponent extends AppComponentBase {

    @ViewChild('languagesTable', {static: true}) languagesTable: ElementRef;
    @ViewChild('createOrEditLanguageModal', {static: true}) createOrEditLanguageModal: CreateOrEditLanguageModalComponent;
    @ViewChild('dataTable', {static: true}) dataTable: Table;
    @ViewChild('paginator', {static: true}) paginator: Paginator;

    defaultLanguageName: string;

    constructor(
        injector: Injector,
        private _languageService: LanguageServiceProxy,
        private _sessionService: AbpSessionService,
        private _router: Router
    ) {
        super(injector);
    }

    getLanguages(): void {
        this.primengTableHelper.showLoadingIndicator();

        this._languageService.getLanguages()
            .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
            .subscribe(result => {
            this.defaultLanguageName = result.defaultLanguageName;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.totalRecordsCount = result.items.length;
            this.primengTableHelper.hideLoadingIndicator();
        });
    }

    changeTexts(language: ApplicationLanguageListDto): void {
        this._router.navigate(['app/admin/languages', language.name, 'texts']);
    }

    setAsDefaultLanguage(language: ApplicationLanguageListDto): void {
        const input = new SetDefaultLanguageInput();
        input.name = language.name;
        this._languageService.setDefaultLanguage(input).subscribe(() => {
            this.getLanguages();
            this.notify.success(this.l('SuccessfullySaved'));
        });
    }

    deleteLanguage(language: ApplicationLanguageListDto): void {
        this.message.confirm(
            this.l('LanguageDeleteWarningMessage', language.displayName),
            this.l('AreYouSure'),
            isConfirmed => {
                if (isConfirmed) {
                    this._languageService.deleteLanguage(language.id).subscribe(() => {
                        this.getLanguages();
                        this.notify.success(this.l('SuccessfullyDeleted'));
                    });
                }
            }
        );
    }

    get multiTenancySideIsHost(): boolean {
        return !this._sessionService.tenantId;
    }
}
