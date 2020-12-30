import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ControlEditDto, ControlValueDto, ControlValueInput, LibraryFormServiceProxy } from '@shared/service-proxies/service-proxies';
import { get } from 'lodash';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'text-area-control',
    templateUrl: './text-area-control.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextAreaControlComponent extends AppComponentBase implements OnInit, AfterViewInit {

    @HostBinding('class.text-area-control') class = true;

    @Input() control: ControlEditDto;
    @Input() index: number;
    @Input() documentId: string;
    @Input() pageId: string;

    textChanged$: Subject<string> = new Subject<string>();
    text: string;

    constructor(
        injector: Injector,
        private _cdk: ChangeDetectorRef,
        private _libraryFormService: LibraryFormServiceProxy,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        if (get(this.control, 'value')) {
            this.text = this.control.value.value;
        }

        this.textChanged$
            .pipe(
                debounceTime(1000),
                distinctUntilChanged(),
                takeUntil(this.onDestroy$)
            ).subscribe(() => {
                const input: ControlValueInput = new ControlValueInput();
                input.controlId = this.control.id;
                input.pageId = this.pageId;
                input.documentId = this.documentId;
                input.value = this.text;
                this._libraryFormService.updateControlValue(input)
                    .subscribe(() => {
                        this.notify.success(this.l('SuccessfullySaved'));
                        this._cdk.markForCheck();
                    });
            });
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
}
