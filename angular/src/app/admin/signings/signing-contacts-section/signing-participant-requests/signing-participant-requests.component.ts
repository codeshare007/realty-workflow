import { Component, Injector, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ResendSigningRequestAccessEmail, SigningAccessRequestDto, SigningParticipantServiceProxy, SigningRequestStatus, UpdateSigningRequestAccessEmail } from '@shared/service-proxies/service-proxies';
import { isUndefined } from 'lodash';
import { LazyLoadEvent, Table } from 'primeng';
import { EditParticipantEmailModalComponent } from '../edit-participant-email-modal/edit-participant-email-modal.component';

@Component({
    selector: 'signing-participant-requests',
    templateUrl: './signing-participant-requests.component.html',
    animations: [accountModuleAnimation()]
})
export class SigningParticipantRequestComponent extends AppComponentBase implements OnInit, OnDestroy {

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('updateParticipantRequestEmailModal', { static: true }) updateParticipantRequestEmailModal: EditParticipantEmailModalComponent;

    @Input() signingId: string;

    active = false;
    saving = false;

    constructor(
        injector: Injector,
        private _signingParticipantServiceProxy: SigningParticipantServiceProxy,
    ) {
        super(injector);
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
    }

    getParticipants(event?: LazyLoadEvent) {
        this._signingParticipantServiceProxy.getAllAccessRequsts(
            this.signingId,
            undefined,
            1000,
            0).subscribe((items: SigningAccessRequestDto[]) => {
                this.primengTableHelper.records = items;
                this.primengTableHelper.totalRecordsCount = items.length;
            });
    }

    getStatusDescription(status: SigningRequestStatus) {
        switch (status) {
            case SigningRequestStatus.Pending: return 'Pending';
            case SigningRequestStatus.Completed: return 'Completed';
            case SigningRequestStatus.Rejected: return 'Rejected';
        }

        return '';
    }

    updateParticipantRequestEmail(data: SigningAccessRequestDto) {
        if (!isUndefined(data.participant)) {
            const input = new UpdateSigningRequestAccessEmail();
            input.signingId = this.signingId;
            input.signingRequestAccessId = data.id;
            input.email = data.participant.email;

            this.updateParticipantRequestEmailModal.show(input);
        }
    }

    onUpdateParticipantRequestEmail(data: UpdateSigningRequestAccessEmail) {
        this._signingParticipantServiceProxy.updateSigningRequestAccessEmail(data)
        .subscribe(() => {
            this.getParticipants();
        }); 
    }

    resendEmailNotification(data: SigningAccessRequestDto) {
        const input = new ResendSigningRequestAccessEmail();
        input.signingId = this.signingId;
        input.signingRequestAccessId = data.id;

        this._signingParticipantServiceProxy.resendSigningRequestAccessEmail(input).subscribe(() => {
            this.notify.success(this.l('SuccessfullySend'));
        }); 
    }
}
