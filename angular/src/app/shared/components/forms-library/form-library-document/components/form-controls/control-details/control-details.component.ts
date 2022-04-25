import { ChangeDetectorRef, Component, Injector, Input, OnInit } from '@angular/core';
import { FormLibraryReloadService } from '@app/admin/forms-library/form-library-document/services/form-library-reload.service';
import { ControlDetailsCheckbox, DropdownSetting } from '@app/shared/components/forms-library/models/table-documents.model';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ContactListDto, ControlEditDto, ControlType } from '@shared/service-proxies/service-proxies';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { PageControlService } from '../../document-view/document-page/page-control/components/services/page-control.service';
import { ControlDetailsService } from '../services/control-details.service';

@Component({
    selector: 'control-details',
    templateUrl: 'control-details.component.html'
})
export class ControlDetailsComponent extends AppComponentBase implements OnInit {

    @Input() participants: ContactListDto[];

    isReload: boolean;
    isAllowedProtect = true;
    isAllowedTitle = true;
    isAllowedPlaceholder = true;
    isAllowedRequired = true;
    detailChanged$: Subject<string> = new Subject<string>();

    get isRequiredDisabled(): boolean {
        if (this.controlDetails && this.controlDetails.additionalSettings) {
            const jsonSetting: DropdownSetting = JSON.parse(this.controlDetails.additionalSettings);
            const settingsList: string[] = jsonSetting ? jsonSetting.options : [];

            return this.controlDetails.type === ControlType.Dropdown
                ? !settingsList.length
                : false;
        }
    }

    get controlDetailsCheckbox() {
        return ControlDetailsCheckbox;
    }

    constructor(
        injector: Injector,
        private _controlDetailsService: ControlDetailsService,
        private _cdr: ChangeDetectorRef,
        private _pageControlService: PageControlService,
        private _formLibraryReloadService: FormLibraryReloadService,
    ) {
        super(injector);
    }

    controlDetails: ControlEditDto = new ControlEditDto();

    ngOnInit(): void {
        this._getSelectControls();
        this._detailChanged();
    }

    public onParticipantChange(participant: ContactListDto): void {
        this.controlDetails.participantId = participant.id;
        this._pageControlService.setReloadControl(this.controlDetails.id);
        this._savingForm();
    }

    public onTitleChange(event): void {
        this.detailChanged$.next(event);
    }

    public onPlaceholderChange(event): void {
        this.detailChanged$.next(event);
    }

    public onDescriptionChange(event): void {
        this.detailChanged$.next(event);
    }

    public onProtectedChange(event): void {
        this._savingForm();
    }

    public onRequiredChange(event: boolean): void {
        if (!this.isRequiredDisabled) {
            this.controlDetails.isRequired = event;
            this._savingForm();
            this._cdr.detectChanges();
            return;
        }

        this.controlDetails.isRequired = false;
        this._savingForm();
    }

    private _savingForm(): void {
        this._formLibraryReloadService.setLoadingChange(true);
    }

    private _detailChanged(): void {
        this.detailChanged$
            .pipe(
                debounceTime(1500),
                takeUntil(this.onDestroy$)
            ).subscribe(() => {
                this._savingForm();

            });
    }

    private _getSelectControls(): void {
        this._controlDetailsService.getSelectControl$()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((details: ControlEditDto) => {
                if (details) {
                    this.controlDetails = details;
                    this.isReload = !this.isReload;
                    this.isAllowedProtect = this.controlDetails.type === ControlType.TextField;
                    this.isAllowedTitle = !this._controlDetailsService.isTooltipeControl(this.controlDetails.type);
                    this.isAllowedPlaceholder = this.controlDetails.type === ControlType.TextField
                        || this.controlDetails.type === ControlType.TextArea;
                    this.isAllowedRequired = this._controlDetailsService.isRequiredControl(this.controlDetails.type);
                }
            });
    }
}
