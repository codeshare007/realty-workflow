import { ControlEditDto, FormEditDto, PageEditDto } from '@shared/service-proxies/service-proxies';
import { uniqBy } from 'lodash';
import { Observable, Subject } from 'rxjs';
import { ParticipantMargeControl, ParticipantMargeControlsGroup, ParticipantMargeForm } from '../models/table-documents.model';

export class ParticipantMargeService {

    // private _participantMargeFormsSubject = new Subject<ParticipantMargeForm[]>()
    private _participantMargeFormsSubject: Subject<ParticipantMargeForm[]> = new Subject<ParticipantMargeForm[]>();
    private _participantMargeForms: ParticipantMargeForm[] = [];
    private _forms: FormEditDto[] = [];

    get participantMargeForms(): ParticipantMargeForm[] {
        return this._participantMargeForms;
    }
    set participantMargeForms(value: ParticipantMargeForm[]) {
        this._participantMargeForms = value;
    }

    get forms(): FormEditDto[] {
        return this._forms;
    }
    set forms(value: FormEditDto[]) {
        this._forms = value;
    }

    public participantMargeFormsSubject(value: ParticipantMargeForm[]): void {
        this._participantMargeFormsSubject.next(value);
    }

    public participantMargeFormsSubject$(): Observable<ParticipantMargeForm[]> {
        return this._participantMargeFormsSubject.asObservable();
    }

    public setParticipantMargeForms(forms: FormEditDto[]): void {
        this.forms = forms;
        this.participantMargeForms = [];
        forms.forEach((form: FormEditDto) => {
            this.participantMargeForms.push(
                new ParticipantMargeForm(
                    form.name,
                    form.participantMappingItems,
                    this._getControlsGroup(form.pages)
                )
            );
        });

        this.participantMargeFormsSubject(this.participantMargeForms);
    }

    public mapSigningForm(): void {
        this.participantMargeForms.forEach((participant: ParticipantMargeForm) => {
            participant.controls.forEach((group: ParticipantMargeControlsGroup) => {
                group.controls.forEach((control: ParticipantMargeControl) => {
                    this._changeParticipantId(control);
                });
            });
        });
    }

    private _changeParticipantId(mappingControl: ParticipantMargeControl): void {
        this.forms.forEach((form: FormEditDto) => {
            form.pages.forEach((page: PageEditDto) => {
                page.controls.forEach((control) => {
                    if (control.id === mappingControl.controlId) {
                        control.participantId = mappingControl.parcipantId;
                    }
                });
            });
        });
    }

    private _getControlsGroup(pages: PageEditDto[]): ParticipantMargeControlsGroup[] {
        const controls: ParticipantMargeControl[] = [];
        pages.forEach((page: PageEditDto) => {
            page.controls.forEach((control: ControlEditDto) => {
                if (control.participantMappingItemId) {
                    controls.push(
                        new ParticipantMargeControl(
                            control.id,
                            control.participantMappingItemId,
                            control.participantId
                        )
                    );
                }
            });
        });

        return this._getControlToGroup(controls);
    }

    private _getControlToGroup(controls: ParticipantMargeControl[]): ParticipantMargeControlsGroup[] {
        const uniqueId: string[] = uniqBy(controls, 'participantMappingItemId')
            .map((control) => {
                return control.participantMappingItemId;
            });

        return this._sortControlToGroup(uniqueId, controls);
    }

    private _sortControlToGroup(uniqueId: string[], controls: ParticipantMargeControl[]): ParticipantMargeControlsGroup[] {
        const controlsGroup: ParticipantMargeControlsGroup[] = [];
        uniqueId.forEach((item: string) => {
            const filteredControl: ParticipantMargeControl[] = controls
                .filter((control: ParticipantMargeControl) => {
                    return control.participantMappingItemId === item;
                });
            controlsGroup.push(
                new ParticipantMargeControlsGroup(item, filteredControl)
            );
        });

        return controlsGroup;
    }
}
