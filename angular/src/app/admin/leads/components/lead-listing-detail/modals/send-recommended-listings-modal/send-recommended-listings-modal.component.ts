import { Component, Injector, ViewChild } from '@angular/core';
import { SelectItem, SelectItemData } from '@app/shared/layout/components/ui-select/models/ui-select.model';
import { AppComponentBase } from '@shared/common/app-component-base';
import { LeadContactServiceProxy, LeadEditDto, PagedResultDtoOfContactListDto, RecommendedListingServiceProxy, SendRecommendedListingsInput } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'send-recommended-listings-modal',
    templateUrl: './send-recommended-listings-modal.component.html',
    styleUrls: ['send-recommended-listings-modal.component.less']
})
export class SendRecommendedListingsModalComponent extends AppComponentBase {

    @ViewChild('sendRecommendedListingsModal', { static: true }) modal: ModalDirective;

    active = false;
    saving = false;
    lead: LeadEditDto;
    subject: string;
    body: string;
    contacts: SelectItem[];
    input: SendRecommendedListingsInput;

    constructor(
        injector: Injector,
        private _recommendedListingService: RecommendedListingServiceProxy,
        private _leadContactService: LeadContactServiceProxy,
    ) {
        super(injector);
    }

    show(lead: LeadEditDto): void {
        this.lead = lead;
        this.subject = '';
        this.body = '';
        this.input = new SendRecommendedListingsInput();
        this.input.id = this.lead.id;
        this.input.ccEmailAddresses = new Array();

        this._leadContactService
            .getAll(undefined, lead.id, undefined, 1000, 0)
            .subscribe((result: PagedResultDtoOfContactListDto) => {
                this.input.emailAddress = result.totalCount > 0 ? result.items[0].email : '';
                this.contacts = result.items.map((c) => {
                    return new SelectItem(
                        c.fullName + ' (' + c.email + ')',
                        c.email,
                        new SelectItemData(c.email)
                    );
                });

                this.active = true;
                this.modal.show();
            });
    }

    onShown(): void {
        document.getElementById('EmailSubject').focus();
    }

    save(): void {
        this._recommendedListingService.sendRecommendedListings(this.input)
            .subscribe(() => {
                this.notify.info(this.l('EmailSuccessfullySent'));
                this.close();
            });
    }


    public onSelectedCcEmailAddresses(event: SelectItem[]): void {
        this.input.ccEmailAddresses = event.map((item) => {
            return item.id;
        });
    }

    close(): void {
        this.active = false;
        this.lead = null;
        this.subject = null;
        this.body = null;
        this.modal.hide();
    }
}
