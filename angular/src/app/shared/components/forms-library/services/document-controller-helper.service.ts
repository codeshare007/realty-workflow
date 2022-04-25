import { ControlEditDto, ControlType, TextPositionType } from '@shared/service-proxies/service-proxies';
import { RGBA } from 'ngx-color';

export class DocumentControlHealperService {

    public isMoqups(type: ControlType): boolean {
        switch (type) {
            case ControlType.Oval:
            case ControlType.Square:
            case ControlType.DiagonalLine:
            case ControlType.HorizontalLine:
            case ControlType.VerticalLine:
                return true;
            default:
                return false;
        }
    }

    public textPositionFlex(control: ControlEditDto): string {
        if (control.type === ControlType.TextField || control.type === ControlType.TextArea) {
            switch (control.textPosition) {
                case TextPositionType.Center:
                    return 'center';
                case TextPositionType.Left:
                    return 'flex-start';
                case TextPositionType.Right:
                    return 'flex-end';
                default:
                    return 'center';
            }
        }

        return 'center';
    }

    public textPositionType(control: ControlEditDto): string {
        if (control.type === ControlType.TextField || control.type === ControlType.TextArea) {
            switch (control.textPosition) {
                case TextPositionType.Center:
                    return 'center';
                case TextPositionType.Left:
                    return 'left';
                case TextPositionType.Right:
                    return 'right';
                default:
                    return 'inherit';
            }
        }

        return 'inherit';
    }

    public isMoqupLine(type: ControlType): boolean {
        switch (type) {
            case ControlType.DiagonalLine:
            case ControlType.HorizontalLine:
            case ControlType.VerticalLine:
                return true;
            default: return false;
        }
    }

    public getColorStage(rgbaColor: string): RGBA {
        const splitColors = rgbaColor.split(',');
        const r = +(splitColors[0].split('(')[1]);
        const g = +(splitColors[1]);
        const b = +(splitColors[2]);
        const a = +(splitColors[3].split(')')[0]);

        return { r, g, b, a };
    }
}
