import { TestBed, ComponentFixture, } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, LOCALE_ID } from '@angular/core';
import { RolesComponent } from './roles.component';
import { RoleServiceProxy, ListResultDtoOfRoleListDto } from '@shared/service-proxies/service-proxies';
import { Observable, Observer } from 'rxjs';

import { AppModule } from '@app/app.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { AppRoutingModule } from '@app/app-routing.module';
import { RouterModule } from '@angular/router';
import { RootModule } from 'root.module';
import { PermissionTreeModalComponent } from '../shared/permission-tree-modal.component';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AppBsModalModule } from '@shared/common/appBsModal/app-bs-modal.module';

describe('RolesComponent', () => {
    let fixture: ComponentFixture<RolesComponent>;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [
                AppModule,
                UtilsModule,
                AppRoutingModule,
                RouterModule.forRoot([]),
                RootModule,
                ServiceProxyModule,
                ModalModule,
                AppBsModalModule
            ],
            declarations: [
                RolesComponent, PermissionTreeModalComponent
            ],
            schemas: [
                NO_ERRORS_SCHEMA
            ],
            providers: [
                { provide: LOCALE_ID, useValue: 'en' }
            ]
        });

        await TestBed.compileComponents();

        fixture = TestBed.createComponent(RolesComponent);

        let _roleService = fixture.debugElement.injector.get(RoleServiceProxy);

        spyOn(_roleService, 'getRoles').and.returnValue(Observable.create((observer: Observer<ListResultDtoOfRoleListDto>) => {
            let list = ListResultDtoOfRoleListDto.fromJS(JSON.parse(`{"items":[{"name":"Admin","displayName":"Admin","isStatic":true,"isDefault":true,"creationTime":"2019-08-22T09:39:10.227975","id":1},{"name":"test","displayName":"test","isStatic":false,"isDefault":false,"creationTime":"2019-08-22T17:19:55.3166397","id":8}]}`));
            observer.next(list);
            return observer;
        }));
    });

    it(`should primengTableHelper has two records`, () => {
        let component = fixture.debugElement.componentInstance as RolesComponent;
        component.getRoles();

        let helper = component.primengTableHelper;

        expect(helper.records).not.toBe(undefined);
        expect(helper.records.length).toBe(2);
    });
});
