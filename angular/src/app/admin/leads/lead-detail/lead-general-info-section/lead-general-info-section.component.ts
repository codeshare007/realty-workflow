import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SelectListItem } from '@app/admin/shared/general-combo-string.component';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateLeadInput, LeadEditDto, LeadServiceProxy, LeadSource, LeadStatus, UpdateLeadInput, UserSearchDto } from '@shared/service-proxies/service-proxies';

@Component({
    selector: 'lead-general-info-section',
    templateUrl: './lead-general-info-section.component.html',
    styleUrls: ['./lead-general-info-section.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [accountModuleAnimation()]
})
export class LeadGeneralSectionComponent extends AppComponentBase implements OnInit, OnChanges {
    @Input() lead: LeadEditDto;
    @Output() leadChange = new EventEmitter<LeadEditDto>();
    @Input() isEditMode: boolean;
    @Output() isEditModeChange = new EventEmitter<boolean>();
    @Input() isOpened: boolean;
    @Output() isOpenedChange = new EventEmitter<boolean>();
    @Output() save = new EventEmitter<boolean>();

    agent: UserSearchDto;
    customer: UserSearchDto;
    statusValues = [
        new SelectListItem(LeadStatus.New, 'New'),
        new SelectListItem(LeadStatus.Active, 'Active'),
        new SelectListItem(LeadStatus.Closed, 'Closed'),
        new SelectListItem(LeadStatus.Disqualified, 'Disqualified')
    ];
    sourceValues = [
        new SelectListItem(LeadSource.Manual, 'Manual'),
        new SelectListItem(LeadSource.YGL, 'Yougotlistings')
    ];

    constructor(
        injector: Injector,
        private _leadService: LeadServiceProxy,
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
        if (this.lead !== undefined) {
            if (this.agent === undefined && this.lead.agentId) {
                this.agent = new UserSearchDto({
                    name: this.lead.agent,
                    publicId: this.lead.agentId
                });
            }

            if (this.customer === undefined && this.lead.customerId) {
                this.customer = new UserSearchDto({
                    name: this.lead.customer,
                    publicId: this.lead.customerId
                });
            }
        }
    }

    getStatusDescription(status: LeadStatus) {
        switch(status) {
            case LeadStatus.New: return 'New';
            case LeadStatus.Active: return 'Active';
            case LeadStatus.Closed: return 'Closed';
            case LeadStatus.Disqualified: return 'Disqualified';
            default: return '';
        }
    }

    getSourceDescription(source: LeadSource) {
        switch(source) {
            case LeadSource.Manual: return 'Manual';
            case LeadSource.YGL: return 'Yougotlistings';
            default: return '';
        }
    }

    saveLead() {
        if (this.lead.id) {
            let input = new UpdateLeadInput();
            input.lead = this.lead;

            this._leadService.updateLead(input).subscribe(id => {
                this.isEditMode = false;
                this._router.navigate(['app/admin/lead', id]);
            });

        } else {
            let input = CreateLeadInput.fromJS(this.lead);

            this._leadService.createLead(input).subscribe(id => {
                this.isEditMode = false;
                this._router.navigate(['app/admin/lead', id]);
            });
        }
    }
}
