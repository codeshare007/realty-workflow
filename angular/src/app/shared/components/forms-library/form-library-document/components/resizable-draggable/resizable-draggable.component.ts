import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { IControlOption } from '../../../models/table-documents.model';

@Component({
    selector: 'resizable-draggable',
    templateUrl: './resizable-draggable.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResizableDraggableComponent extends AppComponentBase implements OnInit, AfterViewInit {

    @ViewChild('box') public box: ElementRef;

    @Input() controlOption: IControlOption;

    controlStyle: Object;

    constructor(
        injector: Injector,
        private _cdk: ChangeDetectorRef,
    ) {
        super(injector);
    }

    ngOnInit() { }

    ngAfterViewInit() {
    }
}
