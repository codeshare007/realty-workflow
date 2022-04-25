import { Injectable } from '@angular/core';
import { ControlLayer, LibraryFormServiceProxy, ParticipantMappingItemDto, ParticipantMappingItemsInput, TransactionFormServiceProxy, UpdateParticipantMappingItemsInput } from '@shared/service-proxies/service-proxies';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class ParticipantSettingService {

    private _participantsChange$: Subject<ParticipantMappingItemDto[]> = new Subject<ParticipantMappingItemDto[]>();
    private _participants: ParticipantMappingItemsInput[] = [];
    public participantHelper: ParticipantMappingItemDto[] = [];
    private _formId: string;
    private _mainId: string;

    get participants(): ParticipantMappingItemsInput[] {
        return this._participants;
    }
    set participants(value: ParticipantMappingItemsInput[]) {
        this._participants = value;
    }

    constructor(
        private _libraryFormServiceProxy: LibraryFormServiceProxy,
        private _transactionFormServiceProxy: TransactionFormServiceProxy,
    ) { }

    public mapParticipant(controls: any[]): void {
        const participants = [];
        controls.forEach((item, index) => {
            const input = new ParticipantMappingItemsInput();
            input.name = item.value;
            input.displayOrder = index + 1;
            input.id = item.participantId;
            participants.push(input);
        });
        this._addDefault(participants);
        this.participants = participants;
    }

    public mapParticipantDto(participants: ParticipantMappingItemDto[]): void {
        const settings: ParticipantMappingItemsInput[] = [];

        participants.forEach((item) => {
            const input = new ParticipantMappingItemsInput();
            input.name = item.name;
            input.id = item.id;
            input.displayOrder = item.displayOrder;
            settings.push(input);
        });

        this._addDefault(settings);
        this.participants = settings;
        this._setParticipantsChange(participants);
        this.participantHelper = participants;
    }

    public updateParticipantsSetting(formId: string, mainId: string, layer: ControlLayer): Observable<ParticipantMappingItemDto[]> {
        this._formId = formId;
        this._mainId = mainId;

        return this._checkUpdateLayer(layer);
    }

    public getParticipantsChange$(): Observable<ParticipantMappingItemDto[]> {
        return this._participantsChange$.asObservable();
    }

    private _setParticipantsChange(value: ParticipantMappingItemDto[]): void {
        this._participantsChange$.next(value);
    }

    private _updateTransaction(): Observable<ParticipantMappingItemDto[]> {
        const input = this._mapParticipantInput();

        return this._transactionFormServiceProxy
            .updateParticipantMappingItems(input);
    }

    private _updateLibrary(): Observable<ParticipantMappingItemDto[]> {
        const input = this._mapParticipantInput();

        return this._libraryFormServiceProxy
            .updateParticipantMappingItems(input);
    }

    private _mapParticipantInput(): UpdateParticipantMappingItemsInput {

        const input = new UpdateParticipantMappingItemsInput();
        input.formId = this._formId;
        input.items = this._participants.filter((item) => item.id !== 'default');
        input.id = this._mainId;

        return input;
    }

    private _checkUpdateLayer(layer: ControlLayer): Observable<ParticipantMappingItemDto[]> {
        switch (layer) {
            case ControlLayer.Library:
                return this._updateLibrary();
            case ControlLayer.Transaction:
                return this._updateTransaction();
        }
    }

    private _addDefaultParticipant(): ParticipantMappingItemsInput {
        const defaultParticipant = new ParticipantMappingItemsInput();
        defaultParticipant.name = 'Unassigned';
        defaultParticipant.id = 'default';
        defaultParticipant.displayOrder = 0;

        return defaultParticipant;
    }

    private _addDefault(arrays: ParticipantMappingItemsInput[]): void {
        const find = arrays.find((item) => {
            return item.id === 'default';
        });
        if (!find) {
            arrays.push(this._addDefaultParticipant());
        }
    }
}
