import { AccessLimitDots, DotOption, LimitDotOption } from '../models/table-documents.model';

export class StickingLinesService {

    readonly stickingStep = 4;

    public getDiff(dots: number[], draggingDots: number[]): number {
        const accessLimitDots: AccessLimitDots[] = this._setAccessLimit(dots);
        const dotOption: DotOption = this._mapDotsOption(draggingDots, accessLimitDots);

        if (dotOption) {
            return dotOption.dot - dotOption.stickingDot;
        }
    }

    private _setAccessLimit(dots: number[]): AccessLimitDots[] {
        return dots.map((dot) => {
            const minDot = dot - this.stickingStep;
            const maxDot = dot + this.stickingStep;

            return new AccessLimitDots(minDot, maxDot, dot);
        });
    }

    private _mapDotsOption(draggingDots: number[], accessLimitDots: AccessLimitDots[]): DotOption {
        const sortBy = (a, b) => a.diff - b.diff;
        const dotsOption = draggingDots.map((dot) => {
            const filteredLimitDots = this._filterLimitDots(dot, accessLimitDots);
            const limitDotOption = this._mapLimitDotOption(dot, filteredLimitDots);
            const sortedLimit = limitDotOption.sort(sortBy);
            if (sortedLimit.length) {
                return this._mapDotOption(dot, sortedLimit[0]);
            }
        });

        return dotsOption.sort(sortBy)[0];
    }

    private _filterLimitDots(dot: number, accessLimitDots: AccessLimitDots[]): AccessLimitDots[] {
        return accessLimitDots.filter((limitDots) => {
            return limitDots.minDot <= dot
                && dot <= limitDots.maxDot;
        });
    }

    private _mapLimitDotOption(dot: number, filteredLimitDots: AccessLimitDots[]): LimitDotOption[] {
        return filteredLimitDots.map((limitDots) => {
            const limitDotOption = new LimitDotOption(
                Math.abs(limitDots.dot - dot),
                limitDots.dot
            );

            return limitDotOption;
        });
    }

    private _mapDotOption(dot: number, sortedLimit: LimitDotOption): DotOption {
        const dotOption = new DotOption(sortedLimit.diff, sortedLimit.stickingDot, dot);

        return dotOption;
    }
}
