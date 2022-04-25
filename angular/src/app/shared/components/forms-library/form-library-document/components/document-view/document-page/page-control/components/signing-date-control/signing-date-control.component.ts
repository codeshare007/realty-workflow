import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Injector, Input, OnInit } from '@angular/core';
import { ControlValueInput, ISignatureInput } from '@app/shared/components/forms-library/models/table-documents.model';
import { FormUrlService } from '@app/shared/components/forms-library/services/http/form-url.service';
import { HttpService } from '@app/shared/components/forms-library/services/http/http.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ControlEditDto } from '@shared/service-proxies/service-proxies';
import { get, isEmpty } from 'lodash';
import * as moment from 'moment';
import { takeUntil } from 'rxjs/operators';
import { SignatureControlService } from '../signature-control/services/signature-control.service';

@Component({
    selector: 'signing-date-control',
    templateUrl: './signing-date-control.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SigningDateControlComponent extends AppComponentBase implements OnInit {

    @HostBinding('class.signing-date-control') class = true;

    @Input() control: ControlEditDto;
    @Input() pageId: string;
    @Input() documentId: string;
    @Input() participantId: string;

    constructor(
        injector: Injector,
        private _cdr: ChangeDetectorRef,
        private _signatureControlService: SignatureControlService,
        private _httpService: HttpService,
        private _formUrlService: FormUrlService,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this._getSigningDateChange();
    }

    private _getSigningDateChange(): void {
        this._signatureControlService.getSigningDateChange$()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((result: ISignatureInput) => {
                // value in this control dont set yet
                // participentId is equal to signature control participantId
                // signature pageID must be equal to this pageID
                // first save on page signature control set all Signing control value
                if (
                    isEmpty(get(this.control, ['value', 'value']))
                    && this.participantId === result.participantId
                    && this.pageId === result.pageId
                ) {
                    this._saveSigningDate();
                }
            });
    }

    private _saveSigningDate(): void {
        const input: ControlValueInput = this._formUrlService.getControlInput();
        input.controlId = this.control.id;
        input.pageId = this.pageId;
        input.formId = this.documentId;
        input.value = moment().format('L');

        this._httpService.post(this._formUrlService.controlUrl, input)
            .subscribe(() => {
                this.notify.success(this.l('SuccessfullySaved'));
            });
    }
}
