import { ListingResposeDto } from '@shared/service-proxies/service-proxies';

// @Injectable({ providedIn: 'root' })
export class LeadListingDetailService {

    // private _isLoadListing: Subject<boolean> = new Subject<boolean>();

    public showDetail: boolean;
    public listingRespose: ListingResposeDto;
    public listingResposeId: string;
    public yGlId: boolean;

    // public setLoadListing(value: boolean): void {
    //     this._isLoadListing.next(value);
    // }

    // public getLoadListing$(): Observable<boolean> {
    //     return this._isLoadListing.asObservable();
    // }
}
