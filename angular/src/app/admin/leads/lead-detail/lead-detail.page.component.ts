import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbItem } from '@app/shared/common/sub-header/sub-header.component';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AddressDto, ContactDto, CreateRecommendedListingInput, LeadEditDto, LeadServiceProxy, LeadSource, LeadStatus, RecommendedListingServiceProxy } from '@shared/service-proxies/service-proxies';
import { Paginator, Table } from 'primeng';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { LeadListingDetailService } from '../components/lead-listing-detail/services/lead-listing-detail.service';
import { RecommendedListingsComponent } from '../recommended-listings/recommended-listings.component';

@Component({
    templateUrl: './lead-detail.page.component.html',
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

    get isShowDetail(): boolean {
        return this._leadListingDetailService.showDetail;
    }

    constructor(
        injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _leadService: LeadServiceProxy,
        private _leadListingDetailService: LeadListingDetailService,
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
            
            if (this.lead.cities && this.lead.cities.length) {
                this.lead.cities = this.lead.cities.filter(c => c !== 'System.String[]');
            } 
            
            if (this.lead.pets && this.lead.pets.length) {
                this.lead.pets = this.lead.pets.filter(c => c !== 'System.String[]');
            } 

            if (lead.contact) {
                this.breadcrumbs = [
                    new BreadcrumbItem(lead.contact.firstName
                        + (lead.contact.middleName && lead.contact.middleName.length
                            ? (' ' + lead.contact.middleName)
                            : '') 
                        + ' ' 
                        + lead.contact.lastName),
                ];
            }
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
                this.lead.contact = new ContactDto();
                this.lead.contact.address = new AddressDto();
                this.lead.zip = '';
                this.lead.streetName = '';
                this.lead.streetNumber = '';
                this.lead.pets = [];
                this.lead.tags = [];
                this.lead.cities = [];
                this.lead.bedrooms = [];
                this.lead.bathrooms = [];
                this.lead.minRent = undefined;
                this.lead.maxRent = undefined;
                this.lead.moveFrom = undefined;
                this.lead.moveTo = undefined;

                this.isEditMode = true;
            }
        });

        this._activatedRoute.data.pipe(
            map(data => data.searchListings),
            filter(searchListings => searchListings),
            takeUntil(this.onDestroy$)
        ).subscribe(searchListings => {
            this.searchListingMode = searchListings;
        });
    }

    public getStatusDescription(status: LeadStatus): string {
        switch (status) {
            case LeadStatus.New: return 'New';
            case LeadStatus.Active: return 'Active';
            case LeadStatus.Closed: return 'Closed';
            case LeadStatus.Disqualified: return 'Disqualified';
        }
    }

    public onSaveListings(): void {
        let input = new CreateRecommendedListingInput();
        input.leadId = this.lead.id;
        input.yglListingIds = this.recommendListingIds;

        this._recommendedListingService.create(input)
            .subscribe((result) => {
                if (result) {
                    this.searchListingMode = false;
                    this.recommendedListings.getItems();
                }
            });
    }
}
