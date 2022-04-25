import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostBinding, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueInput, TypeIndex } from '@app/shared/components/forms-library/models/table-documents.model';
import { FormUrlService } from '@app/shared/components/forms-library/services/http/form-url.service';
import { HttpService } from '@app/shared/components/forms-library/services/http/http.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ControlEditDto, ControlValueDto } from '@shared/service-proxies/service-proxies';
import { get } from 'lodash';
import { Subject } from 'rxjs';
import { debounceTime, delay, distinctUntilChanged, finalize, takeUntil } from 'rxjs/operators';
import { SigningService } from 'signing/services/signing.service';
import { ControlDetailsService } from '../../../../../form-controls/services/control-details.service';

@Component({
    selector: 'text-area-control',
    templateUrl: './text-area-control.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextAreaControlComponent extends AppComponentBase implements OnInit, AfterViewInit {

    @HostBinding('class.text-area-control') class = true;

    @ViewChild('textField') textFieldRef: ElementRef;

    @Input() control: ControlEditDto;
    @Input() index: number;
    @Input() tabIndex: number;
    @Input() participantId: string;
    @Input() publicMode = false;
    @Input() pageId: string;
    @Input() documentId: string;

    textChanged$: Subject<string> = new Subject<string>();
    text: string;

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

    ngOnInit(): void {
        if (get(this.control, 'value')) {
            this.text = this.control.value.value;
        }
        this._textChanged();
        if (this.publicMode) {
            this._setFocusControl();
        }
    }

    ngAfterViewInit() {
    }

    public onTextAreaChange(event: string): void {
        if (get(this.control, 'value')) {
            this.control.value.value = event;
        } else {
            this.control.value = new ControlValueDto();
            this.control.value.value = '';
        }
        this.textChanged$.next(event);
    }

    private _setFilledProgress(): void {
        this._signingService.setFilledProgress(this.control, this.participantId);
    }

    private _textChanged(): void {
        this.textChanged$
            .pipe(
                debounceTime(1500),
                distinctUntilChanged(),
                takeUntil(this.onDestroy$)
            ).subscribe(() => {
                const input: ControlValueInput = this._formUrlService.getControlInput();
                input.controlId = this.control.id;
                input.pageId = this.pageId;
                input.formId = this.documentId;
                input.value = this.text;

                this._httpService.post(this._formUrlService.controlUrl, input)
                    .pipe(
                        delay(0),
                        finalize(() => {
                            this.control.value.value = this.text;
                            this._setFilledProgress();
                        })
                    )
                    .subscribe(() => {
                        this.notify.success(this.l('SuccessfullySaved'));
                        this._cdr.markForCheck();
                    });
            });
    }

    private _setFocusControl(): void {
        this._signingService.getTabChange$()
            .pipe(
                delay(300),
                takeUntil(this.onDestroy$)
            ).subscribe((type: TypeIndex) => {
                if (this.tabIndex === this._signingService.focusStartedControl) {
                    this.textFieldRef.nativeElement.focus();
                    this.textFieldRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
                    this._controlDetailsService.selectControlDetails(this.control);
                    this._cdr.markForCheck();
                } else {
                    this.textFieldRef.nativeElement.blur();
                }
            });
    }
}
