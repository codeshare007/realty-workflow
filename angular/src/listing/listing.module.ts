import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiComponentsModule } from '@app/shared/layout/components/ui-components.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CarouselModule } from 'primeng/carousel';
import { ListingFormComponent } from './components/aside/components/form/listing-form.component';
import { ListingInfoComponent } from './components/aside/components/info/listing-info.component';
import { ListingFeaturesComponent } from './components/features/listing-features.component';
import { ListingFooterComponent } from './components/footer/listing-footer.component';
import { ListingHeaderComponent } from './components/header/listing-header.component';
import { ListingMapComponent } from './components/map/listing-map.component';
import { ListingVideoComponent } from './components/video/listing-video.component';
import { ListingRoutingModule } from './listing-routing.module';
import { ListingComponent } from './listing.component';
import { ListingUrlSafePipe } from './pipes/listing-url-save.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ListingRoutingModule,
        CarouselModule,
        UtilsModule,
        BsDatepickerModule,
        UiComponentsModule,
    ],
    declarations: [
        ListingComponent,
        ListingVideoComponent,
        ListingFeaturesComponent,
        ListingMapComponent,
        ListingInfoComponent,
        ListingFormComponent,
        ListingHeaderComponent,
        ListingFooterComponent,

        ListingUrlSafePipe,
    ],
    providers: [
    ]
})
export class ListingModule { }
