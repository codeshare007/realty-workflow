import { Component, Injector, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { SelectListItem } from "@app/admin/shared/general-combo-string.component";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AppComponentBase } from "@shared/common/app-component-base";
import { PrimengTableHelper } from "@shared/helpers/PrimengTableHelper";
import { ContactSourceType, ContactsServiceProxy, ContactTableDto } from "@shared/service-proxies/service-proxies";
import { LazyLoadEvent, Paginator, Table } from "primeng";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";

@Component({
    templateUrl: './contacts-table.component.html',
    selector: 'contacts-table',
    styleUrls: ['./contacts-table.component.less'],
    encapsulation: ViewEncapsulation.None,
    // styleUrls: ['./customers-page.component.less'],
    animations: [appModuleAnimation()]
})
export class ContactsTableComponent extends AppComponentBase implements OnInit, OnDestroy {

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    primengTableHelperChild: PrimengTableHelper;
    selectedRecordId: string;
    filterText: string;
    agentId: string;
    contactType: ContactSourceType = ContactSourceType.All;

    contactTypeValues = [
        new SelectListItem(ContactSourceType.All, 'All'),
        new SelectListItem(ContactSourceType.Lead, 'Lead'),
        new SelectListItem(ContactSourceType.Transaction, 'Transaction'),
        new SelectListItem(ContactSourceType.Signing, 'Signing')
    ];

    ngOnInit(): void {
        this.filterTextSubject.pipe(debounceTime(500)).subscribe(filterText => {
            this.filterText = filterText;
            this.getList(undefined);
            this.selectedRecordId = undefined;
        });
    }

    ngOnDestroy(): void {
        this.filterTextSubject.complete();
    }

 

    public filterTextSubject: Subject<string> = new Subject<string>();

    constructor (private _contactsService: ContactsServiceProxy,
        private _router: Router,
        injector: Injector){
        super(injector)
        this.primengTableHelperChild = new PrimengTableHelper();
    }

    getList(event?: LazyLoadEvent){
        this._contactsService.getContactList(this.filterText, this.agentId, this.contactType,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getMaxResultCount(this.paginator, event), 
            this.primengTableHelper.getSkipCount(this.paginator, event))
        .subscribe(r=> {this.primengTableHelper.records = r.items;
            this.primengTableHelper.totalRecordsCount = r.totalCount});

    }

    getListForChild(event?: LazyLoadEvent){
        this._contactsService.getByEmail(this.selectedRecordId, this.contactType).subscribe(res=> {
            this.primengTableHelperChild.records = res;
        }
        );
    }

    selectEmail(value: string){
        if (this.selectedRecordId === value){
            this.selectedRecordId = undefined;
            return;
        }
        this.selectedRecordId = value;
        this.getListForChild();
    }

    navigateToRoute(record: ContactTableDto){
        console.log(record.parentId);
        if (!!record.parentId){
        if (record.type === 'Lead Contact'){
            this._router.navigate(['app/admin/leads/', record.parentId]);
        }
        if (record.type === 'Signing Contact'){
            this._router.navigate(['app/admin/signings/', record.parentId]);
        }
        if (record.type === 'Transaction Contact'){
            this._router.navigate(['app/admin/transactions/', record.parentId]);            
        }
     }
    }
    
}