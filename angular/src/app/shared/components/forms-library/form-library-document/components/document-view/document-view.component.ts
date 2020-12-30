import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Injector, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { FormEditDto } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';
import { SwitchSetting } from '../../../models/table-documents.model';
import { SignatureControlModalComponent } from './document-page/page-control/components/signature-control/modal/signature-control-modal.component';
import { SignatureControlService } from './document-page/page-control/components/signature-control/services/signature-control.service';
import { DocumentViewService } from './services/document-view.service';

@Component({
    selector: 'document-view',
    templateUrl: './document-view.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentViewComponent extends AppComponentBase implements OnInit, OnChanges {

    @HostBinding('class.document-view') class = true;

    @ViewChild('signatureControlRef', { static: true })
    signatureControlModal: SignatureControlModalComponent;

    @Input() document: FormEditDto;
    @Input() formLibrarySettings: SwitchSetting = new SwitchSetting();

    constructor(
        injector: Injector,
        private _cdk: ChangeDetectorRef,
        private _documentViewService: DocumentViewService,
        private _signatureControlService: SignatureControlService,
    ) {
        super(injector);
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes.formLibrarySettings) {
            this._documentViewService.formSetting = this.formLibrarySettings;
        }
    }

    ngOnInit(): void {
        this._signatureControlService.getSignatureStateChange$()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((result: boolean) => {
                if (result) {
                    this.signatureControlModal.show();
                    this._cdk.markForCheck();
                }
            });
    }

    public onModalSave(event): void {

    }
}
