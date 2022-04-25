import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ControlDetailsService } from '@app/shared/components/forms-library/form-library-document/components/form-controls/services/control-details.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ControlEditDto } from '@shared/service-proxies/service-proxies';
import { isEmpty } from 'lodash';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'details-control-signing',
    templateUrl: 'details-control-signing.component.html'
})
export class DetailsControlSigningComponent extends AppComponentBase implements OnInit {

    controlDetails: ControlEditDto;
    resetDetailWindow = false;

    constructor(
        injector: Injector,
        private _controlDetailsService: ControlDetailsService,
        private _cdr: ChangeDetectorRef,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this._getSelectControl();
    }

    public showDetail(): boolean {
        if (!this.controlDetails.title || !this.controlDetails.description) {
            return false;
        }

        if (!isEmpty(this.controlDetails)) {
            return !this._controlDetailsService.isTooltipeControl(this.controlDetails.type);
        }

        return false;
    }

    private _getSelectControl(): void {
        this._controlDetailsService.getSelectControl$()
            .pipe(
                takeUntil(this.onDestroy$)
            )
            .subscribe((details: ControlEditDto) => {
                this.resetDetailWindow = false;
                this.controlDetails = details;

                setTimeout(() => {
                    this.resetDetailWindow = true;
                }, 100)
                this._cdr.markForCheck();
            });
    }
}
