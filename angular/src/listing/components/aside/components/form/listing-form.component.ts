import { Component, Injector, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SelectItem } from '@app/shared/layout/components/ui-select/models/ui-select.model';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AskQuestionInput, RecommendedListingServiceProxy, RecommendedPublicListingDto, RequestTourInput, RequestTourTime } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';

@Component({
    selector: 'listing-form',
    templateUrl: './listing-form.component.html'
})
export class ListingFormComponent extends AppComponentBase implements OnChanges {
    @Input() recommendedListing: RecommendedPublicListingDto;

    date: moment.Moment;
    question: string;
    time: RequestTourTime = RequestTourTime.Morning;
    mode = RequestTourTime.Morning;
    times: SelectItem[] = [
        new SelectItem('Morning', '1', { type: RequestTourTime.Morning }),
        new SelectItem('Afternoon', '2', { type: RequestTourTime.Afternoon }),
        new SelectItem('Evening', '3', { type: RequestTourTime.Evening }),
    ];

    constructor(
        injector: Injector,
        private _recommendedListingService: RecommendedListingServiceProxy,
    ) {
        super(injector);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.recommendedListing && this.recommendedListing.listing) {
            this.date = moment(this.recommendedListing.listing.availableDate);
        }
    }

    public onTimeChange(event: SelectItem): void {
        this.time = event.data.type;
    }

    public numberOnly(event: any): boolean {
        let charCode = (event.which) ? event.which : event.keyCode;

        if (charCode < 48 || charCode > 57) { return false; }

        return true;
    }


    public saveTour(): void {
        const input: RequestTourInput = new RequestTourInput({
            id: this.recommendedListing.id,
            requestedTourTime: this.time,
            requestedTourDate: this.date
        });

        this._recommendedListingService.requestTour(input)
            .subscribe(() => {
                this.notify.success('Success Sended Request');
            });
    }

    public saveQuestion(): void {
        const input: AskQuestionInput = new AskQuestionInput({
            id: this.recommendedListing.id,
            question: this.question
        });

        this._recommendedListingService.askQuestion(input)
            .subscribe(() => {
                this.notify.success('Success Sended Question');
            });
    }
}
