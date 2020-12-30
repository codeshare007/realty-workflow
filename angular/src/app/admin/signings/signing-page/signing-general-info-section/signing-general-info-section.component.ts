import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateSigningInput, SigningEditDto, SigningServiceProxy, UpdateSigningInput, UserSearchDto } from '@shared/service-proxies/service-proxies';

@Component({
    selector: 'signing-general-info-section',
    templateUrl: './signing-general-info-section.component.html',
    styleUrls: ['./signing-general-info-section.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [accountModuleAnimation()]
})
export class SigningGeneralSectionComponent extends AppComponentBase implements OnInit, OnChanges {
    @Input() signing: SigningEditDto;
    @Output() signingChange = new EventEmitter<SigningEditDto>();
    @Input() isEditMode: boolean;
    @Output() isEditModeChange = new EventEmitter<boolean>();
    @Output() save = new EventEmitter<boolean>();

    isOpened = true;
    agent: UserSearchDto;

    constructor(
        injector: Injector,
        private _signingService: SigningServiceProxy,
        private _router: Router,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.initUsers();
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
        if (this.signing.id) {
            let input = new UpdateSigningInput();
            input.signing = this.signing;

            this._signingService.update(input).subscribe(id => {
                this.isEditMode = false;
            });

        } else {
            let input = CreateSigningInput.fromJS(this.signing);

            this._signingService.create(input).subscribe(id => {
                this.isEditMode = false;
                this._router.navigate(['app/admin/signings', id]);
            });
        }
    }
}
