import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostBinding, Injector, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ControlValueInput, TypeIndex } from '@app/shared/components/forms-library/models/table-documents.model';
import { FormUrlService } from '@app/shared/components/forms-library/services/http/form-url.service';
import { HttpService } from '@app/shared/components/forms-library/services/http/http.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ControlEditDto, ControlValueDto } from '@shared/service-proxies/service-proxies';
import { isNull } from 'lodash';
import * as moment from 'moment';
import { delay, finalize, takeUntil } from 'rxjs/operators';
import { SigningService } from 'signing/services/signing.service';
import { ControlDetailsService } from '../../../../../form-controls/services/control-details.service';

@Component({
    selector: 'date-time-control',
    templateUrl: './date-time-control.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateTimeControlComponent extends AppComponentBase implements OnInit, OnChanges {

    @HostBinding('class.date-time-control') class = true;

    @ViewChild('datePickerRef', { static: true }) sampleDatePicker: ElementRef;

    @Input() control: ControlEditDto;
    @Input() documentId: string;
    @Input() tabIndex: number;
    @Input() publicMode = false;
    @Input() pageId: string;
    @Input() participantId: string;

    date: moment.Moment;

    constructor(
        injector: Injector,
        private _cdr: ChangeDetectorRef,
        private _signingService: SigningService,
        private _controlDetailsService: ControlDetailsService,
        private _httpService: HttpService,
        private _formUrlService: FormUrlService,
    ) {
        super(injector);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.control) {
            if (this.control.value && this.control.value.value) {
                this.date = moment(this.control.value.value);
            }
        }
    }

    ngOnInit(): void {
        if (this.publicMode) {
            this._setFocusControl();
        }
    }

    public onDateChange(event): void {
        if (!this.control.value) {
            this.control.value = new ControlValueDto();
            this.control.value.value = event;
        } else {
            this.control.value.value = event;
        }
        if (isNull(this.date)) { return; }

        const input: ControlValueInput = this._formUrlService.getControlInput();
        input.controlId = this.control.id;
        input.formId = this.documentId;
        input.pageId = this.pageId;
        input.value = moment(this.date).format('L');

        this._httpService.post(this._formUrlService.controlUrl, input)
            .pipe(
                delay(0),
                finalize(() => {
                    this.control.value.value = moment(this.date).format('L');
                    this._setFilledProgress();
                })
            )
            .subscribe(() => {
                this.notify.success(this.l('SuccessfullySaved'));
                this._cdr.markForCheck();
            });
    }

    public numberOnly(event: any): boolean {
        let charCode = (event.which) ? event.which : event.keyCode;

        if (charCode < 48 || charCode > 57) { return false; }

        return true;
    }

    private _setFilledProgress(): void {
        this._signingService.setFilledProgress(this.control, this.participantId);
    }

    private _setFocusControl(): void {
        this._signingService.getTabChange$()
        .pipe(
            delay(300),
            takeUntil(this.onDestroy$)
            ).subscribe((type: TypeIndex) => {
                const numberTab = type === TypeIndex.Saving ? 1 : 0;
                if (this.tabIndex === this._signingService.focusStartedControl - numberTab) {
                    this.sampleDatePicker.nativeElement.focus();
                    this.sampleDatePicker.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
                    this._controlDetailsService.selectControlDetails(this.control);
                    this._cdr.markForCheck();
                }
            });
    }
}
