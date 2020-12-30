import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommunicationTopicListDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'comms-inbox-aside',
  templateUrl: './comms-inbox-aside.component.html',
  styleUrls: ['./comms-inbox-aside.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommsInboxAsideComponent implements OnChanges {

  @Input() displayMobile: boolean;
  @Input() items: CommunicationTopicListDto[] = [];
  @Output() itemSelected = new EventEmitter<CommunicationTopicListDto>();

  selectedItem: CommunicationTopicListDto;

  offcanvasOptions: any = {
    overlay: true,
    baseClass: 'offcanvas-mobile',
    toggleBy: 'kt_subheader_mobile_toggle'
  };

  ngOnChanges({ items }: SimpleChanges): void {
    if (items && this.itemSelected && !items.currentValue.includes(this.itemSelected)) {
      this.select(undefined);
    }
  }

  select(item: CommunicationTopicListDto) {
    this.selectedItem = item;
    if (this.selectedItem != null) {
      this.selectedItem.isRead = true;
    }
    this.itemSelected.emit(item);
  }
}
