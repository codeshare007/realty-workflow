import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {ManagerComponent} from '@app/admin/dynamic-properties/dynamic-entity-properties/value/manager.component';

@Component({
  templateUrl: './dynamic-entity-property-value.component.html',
  animations: [appModuleAnimation()]
})
export class DynamicEntityPropertyValueComponent extends AppComponentBase implements OnInit {
  @ViewChild('dynamicEntityPropertyValueManager', { static: false }) dynamicEntityPropertyValueManager: ManagerComponent;

  entityFullName: string;
  entityId: string;

  initialized = false;
  constructor(
    _injector: Injector,
    private _activatedRoute: ActivatedRoute
  ) {
    super(_injector);
  }

  ngOnInit() {
    this._activatedRoute.params
      .subscribe(
        (params: Params) => {
          this.entityFullName = params['entityFullName'];
          this.entityId = params['rowId'];
          this.initialized = true;
        });
  }

  saveAll(): void {
    this.dynamicEntityPropertyValueManager.saveAll();
  }
}
