import { Pipe, PipeTransform } from '@angular/core';
import { ParkingItemDto } from '@shared/service-proxies/service-proxies';
import { ParkingAvailability } from '../models/lead-listing.model';

@Pipe({ name: 'leadListingParking' })
export class LeadListingParkingPipe implements PipeTransform {

    transform(parking: ParkingItemDto): string {
        if (!parking) { return '-'; }

        const includeParking = this._getValue(parking.availability);
        const parkingSpace = `${parking.parkingNumber} Space`;
        const solution = [includeParking, parkingSpace];

        return solution.join(', ');
    }

    private _getValue(type: string): string {
        switch (type) {
            case ParkingAvailability.Included:
                return 'Included';
            case ParkingAvailability.Available:
                return 'Available';
            case ParkingAvailability.Garage:
                return 'Garage';
            case ParkingAvailability.Street:
                return 'Street';
            default:
                return type;
        }
    }
}
