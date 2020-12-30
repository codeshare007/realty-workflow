import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostBinding, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ControlEditDto } from '@shared/service-proxies/service-proxies';

@Component({
    selector: 'date-time-control',
    templateUrl: './date-time-control.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateTimeControlComponent extends AppComponentBase implements OnInit, AfterViewInit {

    @HostBinding('class.date-time-control') class = true;

    @ViewChild('datePickerRef', { static: true }) sampleDatePicker: ElementRef;

    @Input() control: ControlEditDto;
    @Input() index: number;

    date: moment.Moment;

    constructor(
        injector: Injector,
        private _cdk: ChangeDetectorRef,
    ) {
        super(injector);
    }

    ngOnInit(): void {
    }

    ngAfterViewInit() {
    }

    public onDateChange(event): void {
        console.log('DateChange: ', event);
    }
}
