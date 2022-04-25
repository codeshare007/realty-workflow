import { ChangeDetectorRef, Component, EventEmitter, HostBinding, Injector, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActionsFormItem, AlignControl, DocumentInfo, DocumentInfoItem, InitialSettingDocument, InitialSettings, PlacementControl } from '@app/shared/components/forms-library/models/table-documents.model';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ContactListDto, ControlType } from '@shared/service-proxies/service-proxies';
import { cloneDeep } from 'lodash';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ParticipantClassPipe } from '../../../document-view/document-page/pipes/participant-class.pipe';
import { FormControlsService } from '../../services/form-controls.service';


@Component({
    selector: 'initial-page-modal',
    templateUrl: './initial-page-modal.component.html',
    providers: [ParticipantClassPipe],
})
export class InitialPageModalComponent extends AppComponentBase implements OnChanges {

    @HostBinding('class.initial-page-modal') class = true;

    @ViewChild('initialPageModal', { static: true }) modal: ModalDirective;
    @ViewChild(NgForm, { static: true }) photoForm: NgForm;

    @Input() participants: ContactListDto[];
    @Input() documentInfo: DocumentInfo;

    @Output() modalSave: EventEmitter<InitialSettings> = new EventEmitter<InitialSettings>();

    active = false;
    numberRegex = /^\d+(-\d+)|\d+(,\d+)*$/; // 1,3,5-9
    saving = false;
    instruction = `Enter either single page numbers separated by a comma or squential pages denoted by a '-'. for example: 1,3,5-9`;
    infoToContinue = 'To continue please select pages and participant';
    settings: InitialSettings = new InitialSettings(
        [
            new ActionsFormItem('Top of document', PlacementControl.PlacementTop),
            new ActionsFormItem('Bottom of document', PlacementControl.PlacementBottom, true),
        ],
        [
            new ActionsFormItem('Align left', AlignControl.AlignLeft),
            new ActionsFormItem('Align center', AlignControl.AlignCenter),
            new ActionsFormItem('Align right', AlignControl.AlignRight, true),
        ]);
    allParticipant = new ActionsFormItem('All Participant', undefined, false, undefined, 'Temp_All_Participant');
    selectedParticipants: ActionsFormItem[] = [];
    participantsActions: ActionsFormItem[] = [];

    get controlType() {
        return ControlType;
    }

    constructor(
        injector: Injector,
        private _cdr: ChangeDetectorRef,
        private _formControlsService: FormControlsService,
        private _participantClassPipe: ParticipantClassPipe,
    ) {
        super(injector);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.participants && this.participants) {
            this._setParticipantsActions();
        }

        if (changes.documentInfo && this.documentInfo) {
            this._setDocumentsActions();
        }
    }

    public show(type: ControlType): void {
        this.active = true;
        this.settings.controltype = type;
        this.modal.show();
    }

    public onShown(): void {
    }

    public onSelectionActions(event: ActionsFormItem, actions: ActionsFormItem[]): void {
        this._resetSettings(actions);
        event.isSelected = true;
    }

    public onSelectDocument(event: ActionsFormItem, actions: ActionsFormItem[]): void {
        event.isSelected = event.isSelected ? false : true;
        if (event.title.includes('Page Range') && event.isSelected) {
            const find = actions.findIndex((item) => !item.title.includes('Page Range'));
            actions[find].isSelected = event.isSelected ? false : true;
        } else if (!event.title.includes('Page Range') && event.isSelected) {
            const find = actions.findIndex((item) => item.title.includes('Page Range'));
            actions[find].isSelected = event.isSelected ? false : true;
        }
    }

    public onSelectionParticipant(event: ActionsFormItem): void {
        event.isSelected = event.isSelected ? false : true;

        if (event.id === 'Temp_All_Participant') {
            this._checkAllParticipant(event.isSelected);
        }
        this._setSelectParticipants();
    }

    public close(): void {
        this.active = false;
        this.modal.hide();
    }

    public save(): void {
        this.settings.selectedParticipants = this.selectedParticipants
            .filter((participant) => {
                return !participant.id.includes('Temp_All_Participant');
            });
        this.modalSave.emit(this.settings);
        this.close();
    }

    public removeParticipant(event: ContactListDto): void {
        const findIndex = this.selectedParticipants.findIndex((item) => {
            return item.id === event.id;
        });

        if (findIndex !== -1) {
            this.selectedParticipants.splice(findIndex, 1);
        }
    }

    public isSelectedPages(): boolean {
        const checkDocuments: boolean[] = [];
        this.settings.documents.forEach((document: InitialSettingDocument) => {
            checkDocuments.push(document.pages.some((page: ActionsFormItem) => {
                if (page.id === 'Temp_Document_id') {
                    return page.isSelected;
                } else {
                    return page.isSelected
                        && page.value.length;
                }
            }));
        });
        const isPageSelected = checkDocuments.some((item) => item);
        const isParticipantSelected = !!this.selectedParticipants.length;

        return isPageSelected && isParticipantSelected;
    }

    public getParticipantClass(participant: ActionsFormItem): string {
        if (!participant) { return; }

        return this._participantClassPipe
            .transform(participant.id, this._formControlsService.controlParticipants);
    }

    private _setSelectParticipants(): void {
        this.selectedParticipants = [];
        this.participantsActions.forEach((participant) => {
            if (participant.isSelected) {
                this.selectedParticipants.push(participant);
            }
        });
    }

    private _resetSettings(setting: ActionsFormItem[]): void {
        setting.map((item) => {
            return item.isSelected = false;
        });
    }

    private _checkAllParticipant(value: boolean): void {
        this.participantsActions.map((participant) => {
            return participant.isSelected = value;
        });
    }

    private _setParticipantsActions(): void {
        this.participantsActions = [cloneDeep(this.allParticipant)];
        this.participants.forEach((participant) => {
            if (!participant.id.includes('default')) {
                this.participantsActions.push(
                    new ActionsFormItem(
                        `${participant.fullName}`,
                        undefined, false, '', participant.id
                    )
                );
            }
        });
    }

    private _setDocumentsActions(): void {
        this.settings.documents = [];
        this.documentInfo.documents.forEach((document: DocumentInfoItem) => {
            this.settings.documents.push(
                new InitialSettingDocument(
                    document.name,
                    document.documentId,
                    [
                        new ActionsFormItem(`All: (${document.pages.length} pages)`, undefined, true, undefined, 'Temp_Document_id'),
                        new ActionsFormItem('Page Range', undefined, false, '', document.documentId),
                    ]
                )
            );
        });
    }
}
