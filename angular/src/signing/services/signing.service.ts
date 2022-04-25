import { Injectable } from '@angular/core';
import { SigningProgressItem, TabIndexControl, TabIndexPage, TypeIndex } from '@app/shared/components/forms-library/models/table-documents.model';
import { ControlEditDto, ControlType, FormEditDto } from '@shared/service-proxies/service-proxies';
import { get, isEmpty, isUndefined } from 'lodash';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SigningService {

    private _isProgressChange$: Subject<boolean> = new Subject<boolean>();
    private _isTabChange$: Subject<TypeIndex> = new Subject<TypeIndex>();
    public signingProgresList: SigningProgressItem[] = [];
    public tabIndexControls: TabIndexControl[] = [];
    public focusStartedControl = 0;
    private _allowedChangeTab = true;
    private _code: string;
    public participantInitials = '';
    public participantName = '';

    get code(): string {
        return this._code;
    }

    set code(value: string) {
        this._code = value;
    }

    get allowedChangeTab(): boolean {
        return this._allowedChangeTab;
    }

    set allowedChangeTab(value: boolean) {
        this._allowedChangeTab = value;
    }

    public getProgressChange$(): Observable<boolean> {
        return this._isProgressChange$.asObservable();
    }

    private _setProgressChange(isProgress: boolean): void {
        this._isProgressChange$.next(isProgress);
    }

    public getTabChange$(): Observable<TypeIndex> {
        return this._isTabChange$.asObservable();
    }

    public setTabChange(type: TypeIndex): void {
        this._isTabChange$.next(type);
    }

    public getArrowPosition(): TabIndexControl {
        const findControl = this.tabIndexControls.find((item) => {
            return this.focusStartedControl === item.tabIndex;
        });
        return findControl ? findControl : undefined;
    }

    public focusFirstRequired(): void {
        const notFilledItems = this.signingProgresList
            .filter((item: SigningProgressItem) => {
                return !item.isFilled;
            });

        const tabIndexControl = this.tabIndexControls
            .find((control: TabIndexControl) => {
                const firstControlWithEmptyValue = notFilledItems.find((item) => {
                    return item.id === control.id;
                });

                return firstControlWithEmptyValue;
            });
        this.focusStartedControl = tabIndexControl ? tabIndexControl.tabIndex : 0;


    }

    public getProgressWidth(): number {
        return this.signingProgresList.length === 0
            ? 0.1 // init progress bar width
            : (
                (100 / this.signingProgresList.length) // get item width
                * this.signingProgresList.filter((item) => item.isFilled).length // get progress bar filled width
            );
    }

    public setFilledProgress(control: ControlEditDto, participantId: string): void {
        if (!isEmpty(this.signingProgresList)) {
            const findIndex = this.signingProgresList.findIndex((item) => {
                return item.id === control.id;
            });
            if (findIndex !== -1 && participantId === control.participantId) {
                if (isUndefined(get(this.signingProgresList[findIndex], 'isFilled'))) { return; }

                if (isEmpty(get(control.value, 'value'))) {
                    this.signingProgresList[findIndex].isFilled = false;
                } else {
                    this._isOptionalSign(findIndex);
                }

                this._setProgressChange(true);
            }
        }
    }

    public setTabIndexControls(forms: FormEditDto[], participantId: string): void {
        this.tabIndexControls = [];
        const participantControls: TabIndexPage[] = [];
        let pageNumber = 0;
        forms.forEach((document) => {
            document.pages.forEach((page) => {
                pageNumber++;
                page.controls.forEach((control) => {
                    if (control.participantId === participantId
                        && control.type !== ControlType.SigningDate
                        && control.type !== ControlType.SignerName) {
                        participantControls.push(new TabIndexPage(control, pageNumber));
                    }
                });
            });
        });
        this._sortingOrderControls(participantControls);
    }

    private _sortingOrderControls(tabIndexPage: TabIndexPage[]): void {
        const sortingControl = tabIndexPage.sort((a, b) => {
            return a.pageNumber - b.pageNumber
                || Math.floor(a.control.position.top / 20) - Math.floor(b.control.position.top / 20)
                || a.control.position.left - b.control.position.left;
        });
        sortingControl.forEach((item: TabIndexPage) => {
            const { control, pageNumber } = item;
            this.tabIndexControls.push(
                new TabIndexControl(
                    control.id,
                    this.tabIndexControls.length + 1,
                    control.position.top,
                    control.size.height,
                    false,
                    pageNumber,
                )
            );
        });
    }

    private _isOptionalSign(index: number): void {
        if (!this.signingProgresList[index].isOptionalSign) {
            this.signingProgresList[index].isFilled = true;

            return;
        }

        if (this.signingProgresList[index].optionalPermissions
            && (this.signingProgresList[index].optionalPermissions.accept
                || this.signingProgresList[index].optionalPermissions.decline)) {
            this.signingProgresList[index].isFilled = true;

            return;
        }

        this.signingProgresList[index].isFilled = false;
    }
}
