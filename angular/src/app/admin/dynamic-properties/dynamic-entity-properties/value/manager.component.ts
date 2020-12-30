import { Component, OnInit, Injector, Input, EventEmitter, Output, InjectionToken } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DynamicEntityPropertyValueServiceProxy, GetAllDynamicEntityPropertyValuesOutputItem, CleanValuesInput, InsertOrUpdateAllValuesInput, InsertOrUpdateAllValuesInputItem } from '@shared/service-proxies/service-proxies';
import { InputTypeConfigurationDefinition, InputTypeConfigurationService } from '@app/shared/common/input-types/input-type-configuration.service';
import { InputTypeComponentBase } from '@app/shared/common/input-types/input-type-component-base';
import { SelectedValuesOptions, ComponentInstanceOptions, AllValuesOptions } from '@app/shared/common/input-types/InputTypeConsts';

export class DynamicEntityPropertyValueViewItem {
  data: GetAllDynamicEntityPropertyValuesOutputItem;
  definition: InputTypeConfigurationDefinition;
  injector: Injector;
  componentInstance: InputTypeComponentBase;
  constructor(data: GetAllDynamicEntityPropertyValuesOutputItem, definition: InputTypeConfigurationDefinition) {
    this.data = data;
    this.definition = definition;
  }
}

@Component({
  selector: 'dynamic-entity-property-value-manager',
  templateUrl: './manager.component.html'
})
export class ManagerComponent extends AppComponentBase implements OnInit {
  @Input() entityFullName: string;
  @Input() entityId: string;
  @Output() onSaveDone: EventEmitter<any> = new EventEmitter<any>();

  initialized = false;
  items: DynamicEntityPropertyValueViewItem[];

  constructor(
    private _injector: Injector,
    private _dynamicEntityPropertyValueService: DynamicEntityPropertyValueServiceProxy,
    private _inputTypeConfigurationService: InputTypeConfigurationService
  ) {
    super(_injector);
  }

  ngOnInit() {
    this.initialize();
  }

  initialize(): void {
    this.initialized = false;
    this._dynamicEntityPropertyValueService
      .getAllDynamicEntityPropertyValues(this.entityFullName, this.entityId)
      .subscribe(
        (data) => {
          if (data.items) {
            this.items = data.items.map((item) => {
              let definition = this._inputTypeConfigurationService.getByInputType(item.inputType);

              let viewItem = new DynamicEntityPropertyValueViewItem(item, definition);

              const componentInstanceCallback = (instance: InputTypeComponentBase) => {
                viewItem.componentInstance = instance;
              };

              let injector = Injector.create(
                {
                  providers: [
                    { provide: SelectedValuesOptions, useValue: item.selectedValues },
                    { provide: AllValuesOptions, useValue: item.allValuesInputTypeHas },
                    { provide: ComponentInstanceOptions, useValue: componentInstanceCallback },
                  ],
                  parent: this._injector
                });

              viewItem.injector = injector;
              return viewItem;
            });
          }
          this.initialized = true;
          this.hideMainSpinner();
        },
        (err) => {
          this.hideMainSpinner();
        }
      );
  }

  deleteAllValuesOfDynamicEntityPropertyId(item: DynamicEntityPropertyValueViewItem): void {
    this.message.confirm(
      this.l('DeleteDynamicEntityPropertyValueMessage', item.data.propertyName),
      this.l('AreYouSure'),
      isConfirmed => {
        if (isConfirmed) {
          this._dynamicEntityPropertyValueService.cleanValues(new CleanValuesInput({
            dynamicEntityPropertyId: item.data.dynamicEntityPropertyId,
            entityId: this.entityId
          })).subscribe(() => {
            abp.notify.success(this.l('SuccessfullyDeleted'));
            this.initialize();
          });
        }
      }
    );
  }

  saveAll(): void {
    if (!this.items || this.items.length === 0) {
      return;
    }

    let newItems: InsertOrUpdateAllValuesInputItem[] = [];
    for (let i = 0; i < this.items.length; i++) {
      const element = this.items[i];
      newItems.push(
        new InsertOrUpdateAllValuesInputItem({
          dynamicEntityPropertyId: element.data.dynamicEntityPropertyId,
          entityId: this.entityId,
          values: element.componentInstance.getSelectedValues()
        })
      );
    }

    this._dynamicEntityPropertyValueService
      .insertOrUpdateAllValues(
        new InsertOrUpdateAllValuesInput({
          items: newItems
        })
      )
      .subscribe(
        () => {
          abp.notify.success(this.l('SavedSuccessfully'));
          this.initialize();
          this.hideMainSpinner();

          if (this.onSaveDone) {
            this.onSaveDone.emit();
          }
        },
        (err) => {
          this.hideMainSpinner();
        }
      );
  }
}
