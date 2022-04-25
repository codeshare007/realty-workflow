import { Pipe, PipeTransform } from '@angular/core';
import { ListingDto } from '@shared/service-proxies/service-proxies';
import { isEmpty, trim } from 'lodash';
import { IncludeRentType } from '../models/lead-listing.model';

@Pipe({ name: 'leadListingRentIncludes' })
export class LeadListingRentIncludesPipe implements PipeTransform {

    transform(leadListing: ListingDto): string {
        if (!leadListing) { return '-'; }

        const includeElectricity = this._getValue(leadListing.includeElectricity, IncludeRentType.IncludeElectricity);
        const includeGas = this._getValue(leadListing.includeGas, IncludeRentType.IncludeGas);
        const includeHeat = this._getValue(leadListing.includeHeat, IncludeRentType.IncludeHeat);
        const includeHotWater = this._getValue(leadListing.includeHotWater, IncludeRentType.IncludeHotWater);
        const listIncludes = [includeElectricity, includeGas, includeHeat, includeHotWater];
        const solution = listIncludes.filter((item) => !isEmpty(trim(item))).join(', ');

        return solution.length ? solution : '-';
    }

    private _getValue(value: string, type: IncludeRentType): string {
        let typeValue = '';
        switch (type) {
            case IncludeRentType.IncludeElectricity:
                typeValue = 'Electricity';
                break;
            case IncludeRentType.IncludeGas:
                typeValue = 'Gas';
                break;
            case IncludeRentType.IncludeHeat:
                typeValue = 'Heat';
                break;
            case IncludeRentType.IncludeHotWater:
                typeValue = 'Hot Water';
                break;
        }

        return +value ? typeValue : '';
    }
}
