import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Injector, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ManageValuesModalComponent } from '@app/admin/dynamic-properties/dynamic-entity-properties/value/manage-values-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { UserIdentifierInput, UserListDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { LocalStorageService } from '@shared/utils/local-storage.service';
import { FileUpload } from 'primeng/fileupload';
import { Paginator } from 'primeng/paginator';
import { LazyLoadEvent } from 'primeng/public_api';
import { Table } from 'primeng/table';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, finalize } from 'rxjs/operators';
import { PermissionTreeModalComponent } from '../shared/permission-tree-modal.component';
import { CreateOrEditUserModalComponent } from './create-or-edit-user-modal.component';
import { EditUserPermissionsModalComponent } from './edit-user-permissions-modal.component';
import { ImpersonationService } from './impersonation.service';

@Component({
    templateUrl: './users.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./users.component.less'],
    animations: [appModuleAnimation()]
})
export class UsersComponent extends AppComponentBase implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('createOrEditUserModal', { static: true }) createOrEditUserModal: CreateOrEditUserModalComponent;
    @ViewChild('editUserPermissionsModal', { static: true }) editUserPermissionsModal: EditUserPermissionsModalComponent;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('ExcelFileUpload', { static: false }) excelFileUpload: FileUpload;
    @ViewChild('permissionFilterTreeModal', { static: true }) permissionFilterTreeModal: PermissionTreeModalComponent;
    @ViewChild('dynamicPropertiesModal', { static: true }) dynamicPropertiesModal: ManageValuesModalComponent;
    public filterTextSubject: Subject<string> = new Subject<string>();

    uploadUrl: string;

    //Filters
    advancedFiltersAreShown = false;
    filterText = '';
    role = '';
    onlyLockedUsers = false;
    userRole = '';
    userRoleName = '';
    userRoleNamePlural = '';
    subscriptionActivatedRouteData: Subscription;
    userPermissions = {
        isGrantedImpersonation: false,
        isGrantedEdit: false,
        isGrantedChangePermissions: false,
        isGrantedDelete: false,
        isGrantedCreate: false
    };

    constructor(
        injector: Injector,
        public _impersonationService: ImpersonationService,
        private _userServiceProxy: UserServiceProxy,
        private _fileDownloadService: FileDownloadService,
        private _activatedRoute: ActivatedRoute,
        private _httpClient: HttpClient,
        private _localStorageService: LocalStorageService
    ) {
        super(injector);
        this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';
        this.uploadUrl = AppConsts.remoteServiceBaseUrl + '/Users/ImportFromExcel';
    }

    ngOnInit() {
        this.subscriptionActivatedRouteData = this._activatedRoute.data.subscribe(data => {
            this.userRole = data.userRole;
            this.userRoleName = data.userRoleName;
            this.userRoleNamePlural = this.getUserRoleNamePlural(data.userRoleName);

            this.processCurrentPermissions(this.userRole);
        });

        this.filterTextSubject.pipe(debounceTime(500)).subscribe(filterText => {
            this.filterText = filterText;
            this.getUsers();
        });
    }

    ngAfterViewInit(): void {
        this.primengTableHelper.adjustScroll(this.dataTable);
    }

    ngOnDestroy() {
        this.filterTextSubject.complete();
        this.subscriptionActivatedRouteData.unsubscribe();
    }

    getUsers(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);

            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._userServiceProxy.getUsers(
            this.filterText,
            this.permissionFilterTreeModal.getSelectedPermissions(),
            this.role !== '' ? [parseInt(this.role)] : undefined,
            this.userRole,
            this.onlyLockedUsers,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event)
        ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.setUsersProfilePictureUrl(this.primengTableHelper.records);
            this.primengTableHelper.hideLoadingIndicator();
        });
    }

    unlockUser(record): void {
        let unlockUserInput = new UserIdentifierInput();
        unlockUserInput.id = record.id;
        unlockUserInput.roleName = this.userRole;

        this._userServiceProxy.unlockUser(unlockUserInput).subscribe(() => {
            this.notify.success(this.l('UnlockedTheUser', record.userName));
        });
    }

    getRolesAsString(roles): string {
        let roleNames = '';

        for (let j = 0; j < roles.length; j++) {
            if (roleNames.length) {
                roleNames = roleNames + ', ';
            }

            roleNames = roleNames + roles[j].roleName;
        }

        return roleNames;
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    // exportToExcel(): void {
    //     this._userServiceProxy.getUsersToExcel(
    //         this.filterText,
    //         this.permissionFilterTreeModal.getSelectedPermissions(),
    //         this.role !== '' ? parseInt(this.role) : undefined,
    //         this.userRole,
    //         this.onlyLockedUsers,
    //         this.primengTableHelper.getSorting(this.dataTable))
    //         .subscribe(result => {
    //             this._fileDownloadService.downloadTempFile(result);
    //         });
    // }

    createUser(): void {
        this.createOrEditUserModal.show(this.userRole, this.userRoleNamePlural);
    }

    editUser(recordId: number, publicId: string) {
        this.createOrEditUserModal.show(this.userRole, this.userRoleNamePlural, recordId, publicId);
    }

    uploadExcel(data: { files: File }): void {
        const formData: FormData = new FormData();
        const file = data.files[0];
        formData.append('file', file, file.name);

        this._httpClient
            .post<any>(this.uploadUrl, formData)
            .pipe(finalize(() => this.excelFileUpload.clear()))
            .subscribe(response => {
                if (response.success) {
                    this.notify.success(this.l('ImportUsersProcessStart'));
                } else if (response.error != null) {
                    this.notify.error(this.l('ImportUsersUploadFailed'));
                }
            });
    }

    onUploadExcelError(): void {
        this.notify.error(this.l('ImportUsersUploadFailed'));
    }

    deleteUser(user: UserListDto): void {
        if (user.userName === AppConsts.userManagement.defaultAdminUserName) {
            this.message.warn(this.l('{0}UserCannotBeDeleted', AppConsts.userManagement.defaultAdminUserName));
            return;
        }

        this.message.confirm(
            this.l('UserDeleteWarningMessage', user.userName),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._userServiceProxy.deleteUser(user.id, user.publicId, this.userRole)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    showDynamicProperties(user: UserListDto): void {
        this.dynamicPropertiesModal.show('Realty.Authorization.Users.User', user.id.toString());
    }

    setUsersProfilePictureUrl(users: UserListDto[]): void {
        for (let i = 0; i < users.length; i++) {
            let user = users[i];
            this._localStorageService.getItem(AppConsts.authorization.encrptedAuthTokenName, function (err, value) {
                let profilePictureUrl = AppConsts.remoteServiceBaseUrl + '/Profile/GetProfilePictureByUser?userId=' + user.id + '&' + AppConsts.authorization.encrptedAuthTokenName + '=' + encodeURIComponent(value.token);
                (user as any).profilePictureUrl = profilePictureUrl;
            });
        }
    }

    processCurrentPermissions(userName: string) {
        let userRolePlural = this.getUserRoleNamePlural(this.userRole);

        this.userPermissions = {
            isGrantedImpersonation: this.permission.isGranted('Pages.Users.' + userRolePlural + '.Impersonation'),
            isGrantedEdit: this.permission.isGranted('Pages.Users.' + userRolePlural + '.Edit'),
            isGrantedChangePermissions: this.permission.isGranted('Pages.Users.' + userRolePlural + '.ChangePermissions'),
            isGrantedDelete: this.permission.isGranted('Pages.Users.' + userRolePlural + '.Delete'),
            isGrantedCreate: this.permission.isGranted('Pages.Users.' + userRolePlural + '.Create')
        };
    }

    getUserRoleNamePlural(userRole: string) {
        let userRolePlural = userRole;

        if (userRolePlural.endsWith('ch') || userRolePlural.endsWith('s')) {
            userRolePlural += 'e';
        }

        userRolePlural += 's';

        return userRolePlural;
    }
}
