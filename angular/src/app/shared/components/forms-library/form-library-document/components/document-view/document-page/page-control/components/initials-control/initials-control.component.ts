import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ControlEditDto } from '@shared/service-proxies/service-proxies';

@Component({
    selector: 'initials-control',
    templateUrl: './initials-control.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InitialsControlComponent extends AppComponentBase implements OnInit, AfterViewInit {

    @HostBinding('class.initials-control') class = true;

    @Input() control: ControlEditDto;
    @Input() index: number;

    initials: string;

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

    public onInitialsChange(event): void {
        console.log('onInitialsChange: ', event);
    }
}
