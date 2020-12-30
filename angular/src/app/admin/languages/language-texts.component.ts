import { AfterViewInit, Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { LanguageServiceProxy } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { LazyLoadEvent } from 'primeng/public_api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { EditTextModalComponent } from './edit-text-modal.component';
import { finalize } from 'rxjs/operators';

@Component({
    templateUrl: './language-texts.component.html',
    styleUrls: ['./language-texts.component.less'],
    animations: [appModuleAnimation()]
})
export class LanguageTextsComponent extends AppComponentBase implements AfterViewInit, OnInit {

    @ViewChild('targetLanguageNameCombobox', {static: true}) targetLanguageNameCombobox: ElementRef;
    @ViewChild('baseLanguageNameCombobox', {static: true}) baseLanguageNameCombobox: ElementRef;
    @ViewChild('sourceNameCombobox', {static: true}) sourceNameCombobox: ElementRef;
    @ViewChild('targetValueFilterCombobox', {static: true}) targetValueFilterCombobox: ElementRef;
    @ViewChild('textsTable', {static: true}) textsTable: ElementRef;
    @ViewChild('editTextModal', {static: true}) editTextModal: EditTextModalComponent;
    @ViewChild('dataTable', {static: true}) dataTable: Table;
    @ViewChild('paginator', {static: true}) paginator: Paginator;

    sourceNames: string[] = [];
    languages: abp.localization.ILanguageInfo[] = [];
    targetLanguageName: string;
    sourceName: string;
    baseLanguageName: string;
    targetValueFilter: string;
    filterText: string;

    constructor(
        injector: Injector,
        private _languageService: LanguageServiceProxy,
        private _router: Router,
        private _activatedRoute: ActivatedRoute
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.sourceNames = _.map(_.filter(abp.localization.sources, source => source.type === 'MultiTenantLocalizationSource'), value => value.name);
        this.languages = abp.localization.languages;
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.init();
        });
    }

    getLanguageTexts(event?: LazyLoadEvent) {
        if (!this.paginator || !this.dataTable || !this.sourceName) {
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._languageService.getLanguageTexts(
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event),
            this.primengTableHelper.getSorting(this.dataTable),
            this.sourceName,
            this.baseLanguageName,
            this.targetLanguageName,
            this.targetValueFilter,
            this.filterText
        ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
        });
    }

    init(): void {
        this._activatedRoute.params.subscribe((params: Params) => {
            this.baseLanguageName = params['baseLanguageName'] || abp.localization.currentLanguage.name;
            this.targetLanguageName = params['name'];
            this.sourceName = params['sourceName'] || 'Realty';
            this.targetValueFilter = params['targetValueFilter'] || 'ALL';
            this.filterText = params['filterText'] || '';

            this.reloadPage();
        });
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    applyFilters(): void {
        this._router.navigate(['app/admin/languages', this.targetLanguageName, 'texts', {
            sourceName: this.sourceName,
            baseLanguageName: this.baseLanguageName,
            targetValueFilter: this.targetValueFilter,
            filterText: this.filterText
        }]);

        if (this.paginator.getPage() !== 0) {
            this.paginator.changePage(0);

            return;
        }
    }

    truncateString(text): string {
        return abp.utils.truncateStringWithPostfix(text, 32, '...');
    }

    refreshTextValueFromModal(): void {
        for (let i = 0; i < this.primengTableHelper.records.length; i++) {
            if (this.primengTableHelper.records[i].key === this.editTextModal.model.key) {
                this.primengTableHelper.records[i].targetValue = this.editTextModal.model.value;
                return;
            }
        }
    }
}
