import { Component, EventEmitter, Injector, Input, OnChanges, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateSigningInput, SigningEditDto, SigningServiceProxy, UpdateSigningInput, UserSearchDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'signing-general-info-section',
    templateUrl: './signing-general-info-section.component.html',
    styleUrls: ['./signing-general-info-section.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [accountModuleAnimation()]
})
export class SigningGeneralSectionComponent extends AppComponentBase implements OnChanges {

    @Input() signing: SigningEditDto;
    @Output() signingChange = new EventEmitter<SigningEditDto>();
    @Input() isEditMode: boolean;
    @Output() isEditModeChange = new EventEmitter<boolean>();
    @Output() save = new EventEmitter<boolean>();

    isOpened = true;
    agent: UserSearchDto;
    saving = false;

    constructor(
        injector: Injector,
        private _signingServiceProxy: SigningServiceProxy,
        private _router: Router,
    ) {
        super(injector);
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.initUsers();
    }

    initUsers() {
        if (this.signing !== undefined) {
            if (this.agent === undefined && this.signing.agentId) {
                this.agent = new UserSearchDto({
                    name: this.signing.agent,
                    publicId: this.signing.agentId
                });
            }
        }
    }

    saveSigning() {
        this.saving = true;
        if (this.signing.id) {
            const input = new UpdateSigningInput();
            input.signing = this.signing;
            this._signingServiceProxy.update(input)
                .pipe(finalize(() => this.saving = false))
                .subscribe((result: string) => {
                    this.isEditMode = false;
                });

        } else {
            const input = CreateSigningInput.fromJS(this.signing);
            this._signingServiceProxy.create(input)
                .pipe(finalize(() => this.saving = false))
                .subscribe((result: string) => {
                    this.isEditMode = false;
                    this._router.navigate(['app/admin/signings', result]);
                });
        }
    }
}
