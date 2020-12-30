import { Component, ElementRef, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ApplicationLanguageEditDto, CreateOrUpdateLanguageInput, LanguageServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { SelectItem } from 'primeng/api';
import * as _ from 'lodash';

@Component({
    selector: 'createOrEditLanguageModal',
    templateUrl: './create-or-edit-language-modal.component.html'
})
export class CreateOrEditLanguageModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @ViewChild('languageCombobox', { static: true }) languageCombobox: ElementRef;
    @ViewChild('iconCombobox', { static: true }) iconCombobox: ElementRef;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    language: ApplicationLanguageEditDto = new ApplicationLanguageEditDto();
    languageNamesSelectItems: SelectItem[] = [];
    flagsSelectItems: SelectItem[] = [];

    constructor(
        injector: Injector,
        private _languageService: LanguageServiceProxy
    ) {
        super(injector);
    }

    show(languageId?: number): void {
        this.active = true;

        this._languageService.getLanguageForEdit(languageId).subscribe(result => {
            this.language = result.language;

            this.languageNamesSelectItems = _.map(result.languageNames, function(language) {
                return {
                    label: language.displayText, value: language.value
                };
            });

            this.flagsSelectItems = _.map(result.flags, function(flag) {
                return {
                    label: flag.displayText, value: flag.value
                };
            });

            if (!languageId) {
                this.language.isEnabled = true;
            }

            this.modal.show();
        });
    }

    save(): void {
        let input = new CreateOrUpdateLanguageInput();
        input.language = this.language;

        this.saving = true;
        this._languageService.createOrUpdateLanguage(input)
            .pipe(finalize(() => this.saving = false))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
            });
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
