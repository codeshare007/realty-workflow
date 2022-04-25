import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppBsModalModule } from '@shared/common/appBsModal/app-bs-modal.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { CarouselModule } from 'primeng/carousel';
import { LeadListingCarouselComponent } from './components/lead-listing-carousel/lead-listing-carousel.component';
import { LeadListingItemComponent } from './components/lead-listing-item/lead-listing-item.component';
import { LeadListingVideoComponent } from './components/video/lead-listing-video.component';
import { LeadListingDetailComponent } from './lead-listing-detail.component';
import { LeadImagesModalComponent } from './modals/lead-images/lead-images-modal.component';
import { LeadListingBadsPipe } from './pipes/lead-listing-bads.pipe';
import { LeadListingDatePipe } from './pipes/lead-listing-date.pipe';
import { LeadListingFeePipe } from './pipes/lead-listing-fee.pipe';
import { LeadListingParkingPipe } from './pipes/lead-listing-parking.pipe';
import { LeadListingRentIncludesPipe } from './pipes/lead-listing-rent-includes.pipe';
import { LeadListingSourcePipe } from './pipes/lead-listing-source.pipe';
import { LeadListingTitlePipe } from './pipes/lead-listing-title.pipe';
import { LeadRequestTourTimePipe } from './pipes/lead-request-tour-time.pipe';
import { UrlSafePipe } from './pipes/url-iframe.pipe';
import { LeadListingDetailService } from './services/lead-listing-detail.service';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        CarouselModule,
        AppBsModalModule,
        UtilsModule,
    ],
    declarations: [
        LeadListingDetailComponent,
        LeadListingItemComponent,
        LeadListingCarouselComponent,
        LeadImagesModalComponent,
        LeadListingVideoComponent,

        UrlSafePipe,
        LeadListingTitlePipe,
        LeadListingDatePipe,
        LeadListingBadsPipe,
        LeadListingFeePipe,
        LeadListingRentIncludesPipe,
        LeadListingSourcePipe,
        LeadListingParkingPipe,
        LeadRequestTourTimePipe,
    ],
    exports: [
        LeadListingDetailComponent,

        LeadListingFeePipe,
    ],
    providers: [
        LeadListingDetailService,
    ]
})
export class LeadListingDetailModule { }
