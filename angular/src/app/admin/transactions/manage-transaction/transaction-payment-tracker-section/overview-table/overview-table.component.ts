import { Component, HostBinding, Input } from '@angular/core';
import { TransactionPaymentTrackerDto } from '@shared/service-proxies/service-proxies';

@Component({
    selector: 'overview-table',
    templateUrl: './overview-table.component.html'
})
export class OverviewTableComponent {

    @HostBinding('class.overview-table') class = true;

    @Input() dueFromTenant: number;
    @Input() dueFromLandlord: number;
    @Input() dueLandlord: number;
    @Input() totalOfficeFeeEarned: number;
    @Input() transactionPaymentTracker: TransactionPaymentTrackerDto;
}
