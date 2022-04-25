import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'ui-tooltip',
    template: `<div [innerHtml]="text"></div>`,
    styleUrls: ['./ui-tool-tip.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiToolTipComponent {

    @Input() text = '';
}
