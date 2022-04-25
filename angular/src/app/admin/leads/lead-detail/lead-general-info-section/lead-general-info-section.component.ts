import { Component, EventEmitter, HostBinding, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { SelectListItem } from '@app/admin/shared/general-combo-string.component';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateLeadInput, LeadEditDto, LeadServiceProxy, LeadSource, LeadStatus, UpdateLeadInput, UserSearchDto } from '@shared/service-proxies/service-proxies';
import { TagsChangedEvent } from 'ngx-tags-input';

@Component({
    selector: 'lead-general-info-section',
    templateUrl: './lead-general-info-section.component.html',
    animations: [accountModuleAnimation()]
})
export class LeadGeneralSectionComponent extends AppComponentBase implements OnInit, OnChanges {

    @HostBinding('class.lead-general-info-section') class = true;

    @Input() lead: LeadEditDto;
    @Input() isEditMode: boolean;
    @Input() isOpened: boolean;

    @Output() leadChange = new EventEmitter<LeadEditDto>();
    @Output() isEditModeChange = new EventEmitter<boolean>();
    @Output() isOpenedChange = new EventEmitter<boolean>();
    @Output() save = new EventEmitter<boolean>();

    agent: UserSearchDto;
    customer: UserSearchDto;
    tags = [];
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
        // this._initUsers();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this._initUsers();
    }

    public getStatusDescription(status: LeadStatus): string {
        switch (status) {
            case LeadStatus.New: return 'New';
            case LeadStatus.Active: return 'Active';
            case LeadStatus.Closed: return 'Closed';
            case LeadStatus.Disqualified: return 'Disqualified';
            default: return '';
        }
    }

    public getSourceDescription(source: LeadSource): string {
        switch (source) {
            case LeadSource.Manual: return 'Manual';
            case LeadSource.YGL: return 'Yougotlistings';
            default: return '';
        }
    }

    public onTagsChanged(event: TagsChangedEvent): void {
        this.lead.tags = this.tags.map((tag) => tag.displayValue);
    }

    public saveLead(): void {
        if (this.lead.id) {
            let input = new UpdateLeadInput();
            input.lead = this.lead;

            this._leadService.updateLead(input).subscribe(id => {
                this.isEditMode = false;
                this._router.navigate(['app/admin/lead', id]);
            });

        } else {
            const input = new CreateLeadInput();
            input.status = this.lead.status;
            input.source = this.lead.source;
            input.externalSource = this.lead.externalSource;
            input.externalId = this.lead.externalId;
            input.notes = this.lead.notes;
            input.contact = this.lead.contact;
            input.agentId = this.lead.agentId;
            input.customerId = this.lead.customerId;
            input.minRent = this.lead.minRent;
            input.maxRent = this.lead.maxRent;
            input.moveFrom = this.lead.moveFrom;
            input.moveTo = this.lead.moveTo;
            input.tags = this.lead.tags.length ? this.lead.tags.join(', ') : '';
            input.cities = this.lead.cities.length ? this.lead.cities.join(', ') : '';
            input.pets = this.lead.pets.length ? this.lead.pets.join(', ') : '';
            input.beds = this.lead.bedrooms.length ? this.lead.bedrooms.join(', ') : '';

            this._leadService.createLead(input).subscribe(id => {
                this.isEditMode = false;
                this._router.navigate(['app/admin/lead', id]);
            });
        }
    }

    private _initUsers(): void {
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
}
