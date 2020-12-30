import { IDocumentPageControl, IDragDropControl } from '../models/table-documents.model';

export class DragDropHealperService {

    public mapControlItem(controls: IDocumentPageControl[]): IDragDropControl[] {
        const dragDropControls: IDragDropControl[] = controls.map((element) => {
            return new IDragDropControl(element);
        });
        return dragDropControls;
    }
    public mapPageControlItem(pages: IDocumentPageControl[]): IDragDropControl[] {
        let a = IDocumentPageControl;
        const dragDropControls: IDragDropControl[] = pages.map((element) => {
            return new IDragDropControl(element);
        });
        return dragDropControls;
    }
}
