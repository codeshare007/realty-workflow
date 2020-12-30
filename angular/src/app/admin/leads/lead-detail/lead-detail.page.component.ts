import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbItem } from '@app/shared/common/sub-header/sub-header.component';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AddressDto, ContactDto, ContactType, CreateRecommendedListingInput, LeadEditDto, LeadServiceProxy, LeadSource, LeadStatus, RecommendedListingServiceProxy } from '@shared/service-proxies/service-proxies';
import { Paginator, Table } from 'primeng';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { RecommendedListingsComponent } from '../recommended-listings/recommended-listings.component';

@Component({
    templateUrl: './lead-detail.page.component.html',
    styleUrls: ['./lead-detail.page.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [accountModuleAnimation()]
})
export class LeadDetailComponent extends AppComponentBase implements OnInit {
    active = false;
    saving = false;
    searchListingMode = false;
    recommendListingIds = new Array();
    isEditMode = false;

    accordionOptions = {
        generalInfoOpened: true,
        recommendedListingsOpened: true,
        communicationOpened: false,
    };

    breadcrumbs;

    @ViewChild('recommendedListings', { static: true }) recommendedListings: RecommendedListingsComponent;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    lead: LeadEditDto = new LeadEditDto();

    constructor(
        injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _leadService: LeadServiceProxy,
        private _recommendedListingService: RecommendedListingServiceProxy,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this._activatedRoute.params.pipe(
            map(params => params.id),
            filter(id => id !== undefined),
            switchMap(id => this._leadService.getForEdit(id)),
            takeUntil(this.onDestroy$)
        ).subscribe((lead: LeadEditDto) => {
            this.lead = lead;

            this.breadcrumbs = [
                new BreadcrumbItem(this.lead.externalId),
            ];
        });

        this._activatedRoute.data.pipe(
            map(data => data.isCreate),
            filter(isCreate => isCreate !== undefined),
            takeUntil(this.onDestroy$)
        ).subscribe(isCreate => {
            if (isCreate) {
                this.lead = new LeadEditDto();
                this.lead.status = LeadStatus.New;
                this.lead.source = LeadSource.Manual;
                this.lead.contact = new ContactDto({
                    type: ContactType.General,
                    firstName: '',
                    middleName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    legalName: '',
                    preferredSignature: '',
                    preferredInitials: '',
                    firm: '',
                    suffix: '',
                    company: '',
                    lastModificationTime: undefined,
                    id: undefined,
                    address: new AddressDto({
                        streetNumber: '',
                        streetName: '',
                        unitNumber: '',
                        city: '',
                        state: '',
                        zipCode: '',
                        id: undefined
                    })
                });
                this.isEditMode = true;
            }
        });
    }

    getStatusDescription(status: LeadStatus) {
        switch(status) {
            case LeadStatus.New: return 'New';
            case LeadStatus.Active: return 'Active';
            case LeadStatus.Closed: return 'Closed';
            case LeadStatus.Disqualified: return 'Disqualified';
        }
    }

    onSaveListings() {
        let input = new CreateRecommendedListingInput();
        input.leadId = this.lead.id;
        input.yglListingIds = this.recommendListingIds;

        this._recommendedListingService.create(input).subscribe(result => {
            if (result) {
                this.searchListingMode = false;
                this.recommendedListings.getItems();
            }
        });
    }
}
