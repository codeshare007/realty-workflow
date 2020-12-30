import { Component, OnInit, Injector, Input, ViewChild, OnDestroy } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DashboardViewConfigurationService } from './dashboard-view-configuration.service';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import {
  DashboardCustomizationServiceProxy, DashboardOutput, AddNewPageInput,
  AddNewPageOutput, AddWidgetInput, RenamePageInput, SavePageInput, Page, Widget, WidgetFilterOutput, WidgetOutput
} from '@shared/service-proxies/service-proxies';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';
import { WidgetViewDefinition, WidgetFilterViewDefinition } from './definitions';
import { AddWidgetModalComponent } from './add-widget-modal/add-widget-modal.component';
import { DashboardCustomizationConst } from './DashboardCustomizationConsts';
import { ModalDirective } from 'ngx-bootstrap/modal';
import * as rtlDetect from 'rtl-detect';

@Component({
  selector: 'customizable-dashboard',
  templateUrl: './customizable-dashboard.component.html',
  styleUrls: ['./customizable-dashboard.component.css'],
  animations: [appModuleAnimation()]
})

export class CustomizableDashboardComponent extends AppComponentBase implements OnInit, OnDestroy {
  @Input() dashboardName: string;

  @ViewChild('addWidgetModal') addWidgetModal: AddWidgetModalComponent;
  @ViewChild('dashboardTabs') dashboardTabs: TabsetComponent;
  @ViewChild('filterModal', { static: true }) modal: ModalDirective;
  @ViewChild('dropdownRenamePage') dropdownRenamePage: BsDropdownDirective;
  @ViewChild('dropdownAddPage') dropdownAddPage: BsDropdownDirective;

  loading = true;
  busy = true;
  editModeEnabled = false;

  dashboardDefinition: DashboardOutput;

  //gridster options. all gridster needs its options. In our scenario, they are all same.
  options: GridsterConfig[] = [];

  userDashboard: any;

  selectedPage = {
    id: '',
    name: ''
  };

  renamePageInput = '';
  addPageInput = '';

  constructor(injector: Injector,
    private _dashboardViewConfiguration: DashboardViewConfigurationService,
    private _dashboardCustomizationServiceProxy: DashboardCustomizationServiceProxy
  ) {
    super(injector);
  }

  ngOnInit() {
    this.loading = true;

    this._dashboardCustomizationServiceProxy.getDashboardDefinition(this.dashboardName, DashboardCustomizationConst.Applications.Angular)
      .subscribe((dashboardDefinitionResult: DashboardOutput) => {
        this.dashboardDefinition = dashboardDefinitionResult;
        if (!this.dashboardDefinition.widgets || this.dashboardDefinition.widgets.length === 0) {
          this.loading = false;
          this.busy = false;
          return;
        }

        let savedUserDashboard = this.getUserDashboard(this.dashboardName);

        this.initializeUserDashboardDefinition(savedUserDashboard, dashboardDefinitionResult);
        this.initializeUserDashboardFilters();

        //select first page (if user delete all pages server will add default page to userDashboard.)
        this.selectedPage = {
          id: this.userDashboard.pages[0].id,
          name: this.userDashboard.pages[0].name
        };

        this.loading = false;
        this.busy = false;
      });

    this.subAsideTogglerClick();
  }

  ngOnDestroy(): void {
    this.unSubAsideTogglerClick();
  }

  initializeUserDashboardDefinition(savedUserDashboard: any, dashboardDefinitionResult: DashboardOutput) {
    this.userDashboard = {
      dashboardName: this.dashboardName,
      filters: [],
      pages: savedUserDashboard.Pages.map(page => {
        //gridster should has its own options
        this.options.push(this.getGridsterConfig());

        if (!page.Widgets) {
          return {
            id: page.Id,
            name: page.Name,
            widgets: []
          };
        }

        //only use widgets which dashboard definition contains and have view definition
        //(dashboard definition can be changed after users save their dashboard, because it depends on permissions and other stuff)
        page.Widgets = page.Widgets.filter(w => dashboardDefinitionResult.widgets.find(d => d.id === w.WidgetId) && this.getWidgetViewDefinition(w.WidgetId));

        return {
          id: page.Id,
          name: page.Name,
          widgets: page.Widgets.map(widget => {
            return {
              id: widget.WidgetId,
              //View definitions are stored in the angular side(a component of widget/filter etc.) get view definition and use defined component
              component: this.getWidgetViewDefinition(widget.WidgetId).component,
              gridInformation: {
                id: widget.WidgetId,
                cols: widget.Width,
                rows: widget.Height,
                x: widget.PositionX,
                y: widget.PositionY,
              }
            };
          })
        };

      })
    };
  }

  removeItem(item: GridsterItem) {
    let page = this.userDashboard.pages.find(p => p.id === this.selectedPage.id);
    let widget = page.widgets.find(w => w.id === item.id);
    let widgetDefinition = this.dashboardDefinition.widgets.find((widgetDef: WidgetOutput) => widgetDef.id === item.id);

    if (!widget || !widgetDefinition) {
      return;
    }

    this.message.confirm(
      this.l('WidgetDeleteWarningMessage', this.l(widgetDefinition.name), this.selectedPage.name),
      this.l('AreYouSure'),
      isConfirmed => {
        if (isConfirmed) {
          page.widgets.splice(page.widgets.indexOf(widget), 1);
        }
      }
    );
  }

  addWidget(widgetId: any): void {
    if (!widgetId) {
      return;
    }

    let widgetViewConfiguration = this._dashboardViewConfiguration.WidgetViewDefinitions.find(w => w.id === widgetId);
    if (!widgetViewConfiguration) {
      abp.notify.error(this.l('ThereIsNoViewConfigurationForX', widgetId));
      return;
    }

    let page = this.userDashboard.pages.find(page => page.id === this.selectedPage.id);
    if (page.widgets.find(w => w.id === widgetId)) {
      return;
    }

    this.busy = true;

    this._dashboardCustomizationServiceProxy.addWidget(new AddWidgetInput({
      widgetId: widgetId,
      pageId: this.selectedPage.id,
      dashboardName: this.dashboardName,
      width: widgetViewConfiguration.defaultWidth,
      height: widgetViewConfiguration.defaultHeight,
      application: DashboardCustomizationConst.Applications.Angular
    })).subscribe((addedWidget) => {
      this.userDashboard.pages.find(page => page.id === this.selectedPage.id).widgets.push({
        id: widgetId,
        component: widgetViewConfiguration.component,
        gridInformation: {
          id: widgetId,
          cols: addedWidget.width,
          rows: addedWidget.height,
          x: addedWidget.positionX,
          y: addedWidget.positionY,
        }
      });

      this.initializeUserDashboardFilters();

      this.busy = false;
      this.notify.success(this.l('SavedSuccessfully'));
    });
  }

  private getUserDashboards(): any[] {
    let settings = this.s('App.DashboardCustomization.Configuration' + '.' + DashboardCustomizationConst.Applications.Angular);
    let obj = JSON.parse(settings);
    return obj;
  }

  private getUserDashboard(name: string) {
    return this.getUserDashboards().filter(dashboard => dashboard.DashboardName === name)[0];
  }

  private getWidgetViewDefinition(id: string): WidgetViewDefinition {
    return this._dashboardViewConfiguration.WidgetViewDefinitions.find(widget => widget.id === id);
  }

  private getWidgetFilterViewDefinition(id: string): WidgetFilterViewDefinition {
    return this._dashboardViewConfiguration.widgetFilterDefinitions.find(filter => filter.id === id);
  }

  changeEditMode(): void {
    this.editModeEnabled = !this.editModeEnabled;
    //change all gridster options
    this.refreshAllGrids();
  }

  refreshAllGrids(): void {
    if (this.options) {
      this.options.forEach(option => {
        option.draggable.enabled = this.editModeEnabled;
        option.resizable.enabled = this.editModeEnabled;
        option.api.optionsChanged();
      });
    }
  }

  openAddWidgetModal(): void {
    let page = this.userDashboard.pages.find(page => page.id === this.selectedPage.id);
    if (page) {
      let widgets = this.dashboardDefinition.widgets.filter((widgetDef: WidgetOutput) => !page.widgets.find(widgetOnPage => widgetOnPage.id === widgetDef.id));
      this.addWidgetModal.show(widgets);
    }
  }

  addNewPage(pageName: string): void {
    if (!pageName || pageName.trim() === '') {
      this.notify.warn(this.l('PageNameCanNotBeEmpty'));
      return;
    }

    pageName = pageName.trim();

    this.busy = true;
    this._dashboardCustomizationServiceProxy.addNewPage(
      new AddNewPageInput({
        dashboardName: this.dashboardName,
        name: pageName,
        application: DashboardCustomizationConst.Applications.Angular
      })
    ).subscribe((result: AddNewPageOutput) => {
      //gridster options for new page
      this.options.push(this.getGridsterConfig());

      this.userDashboard.pages.push({
        id: result.pageId,
        name: pageName,
        widgets: []
      });

      this.busy = false;
      this.notify.success(this.l('SavedSuccessfully'));

      if (this.selectedPage.id === '') {
        this.selectPageTab(result.pageId);
      }
    });

    this.dropdownAddPage.hide();
  }

  selectPageTab(pageId: string): void {
    if (!pageId) {
      this.selectedPage = {
        id: '',
        name: ''
      };

      return;
    }

    this.selectedPage = {
      id: pageId,
      name: this.userDashboard.pages.find(page => page.id === pageId).name
    };

    //when tab change gridster should redraw because if a tab is not active gridster think that its height is 0 and do not draw it.
    this.options.forEach(option => {
      if (option.api) {
        option.api.optionsChanged();
      }
    });
  }

  renamePage(pageName: string): void {
    if (!pageName || pageName === '') {
      this.notify.warn(this.l('PageNameCanNotBeEmpty'));
      return;
    }

    pageName = pageName.trim();

    this.busy = true;

    let pageId = this.selectedPage.id;
    this._dashboardCustomizationServiceProxy.renamePage(
      new RenamePageInput({
        dashboardName: this.dashboardName,
        id: pageId,
        name: pageName,
        application: DashboardCustomizationConst.Applications.Angular
      })
    ).subscribe(() => {
      let dashboardPage = this.userDashboard.pages.find(page => page.id === pageId);
      dashboardPage.name = pageName;
      this.notify.success(this.l('Renamed'));
      this.busy = false;
    });

    this.dropdownRenamePage.hide();
  }

  deletePage(): void {
    let message = this.userDashboard.pages.length > 1
      ? this.l('PageDeleteWarningMessage', this.selectedPage.name)
      : this.l('BackToDefaultPageWarningMessage', this.selectedPage.name);

    this.message.confirm(
      message,
      this.l('AreYouSure'),
      isConfirmed => {
        if (isConfirmed) {
          this.busy = true;
          this._dashboardCustomizationServiceProxy.deletePage(this.selectedPage.id, this.dashboardName, DashboardCustomizationConst.Applications.Angular)
            .subscribe(() => {
              let dashboardPage = this.userDashboard.pages.find(page => page.id === this.selectedPage.id);

              this.options.pop(); // since all of our gridster has same options, its not important which options we are removing
              this.userDashboard.pages.splice(this.userDashboard.pages.indexOf(dashboardPage), 1);
              this.activateFirstPage();

              this.busy = false;
              this.notify.success(this.l('SuccessfullyRemoved'));

              if (this.userDashboard.pages.length === 0) {
                window.location.reload();
              }
            });
        }
      }
    );
  }

  activateFirstPage() {
    if (this.userDashboard.pages[0]) {
      setTimeout(() => {
        let tab = this.dashboardTabs.tabs[0];
        tab.active = true;
      }, 0);

      this.selectPageTab(this.userDashboard.pages[0].id);
      this.initializeUserDashboardFilters();
    } else {
      this.selectPageTab(null);
    }
  }

  savePage(): void {
    this.busy = true;
    let savePageInput = new SavePageInput({
      dashboardName: this.dashboardName,
      pages: this.userDashboard.pages.map(page => {
        return new Page({
          id: page.id,
          name: page.name,
          widgets: page.widgets.map(widget => {
            return new Widget({
              widgetId: widget.gridInformation.id,
              height: widget.gridInformation.rows,
              width: widget.gridInformation.cols,
              positionX: widget.gridInformation.x,
              positionY: widget.gridInformation.y,
            });
          })
        });
      }),
      application: DashboardCustomizationConst.Applications.Angular
    });

    this._dashboardCustomizationServiceProxy.savePage(savePageInput)
      .subscribe(() => {
        this.changeEditMode(); //after changes saved close edit mode
        this.initializeUserDashboardFilters();

        this.busy = false;
        this.notify.success(this.l('SavedSuccessfully'));
        window.location.reload();
      });
  }

  //all pages use gridster and its where they get their options. Changing this will change all gristers.
  private getGridsterConfig(): GridsterConfig {
    const isRtl = rtlDetect.isRtlLang(abp.localization.currentLanguage.name);
    return {
      pushItems: true,
      draggable: {
        enabled: this.editModeEnabled
      },
      resizable: {
        enabled: this.editModeEnabled
      },
      fixedRowHeight: 30,
      fixedColWidth: 30,
      gridType: 'verticalFixed',
      dirType: isRtl ? 'rtl' : 'ltr'
    };
  }

  moreThanOnePage(): boolean {
    return this.userDashboard && this.userDashboard.pages && this.userDashboard.pages.length > 1;
  }

  close(): void {
    this.modal.hide();
  }

  addPageDropdownShown(): void {
    this.addPageInput = '';
  }

  renamePageDropdownShown(): void {
    this.renamePageInput = '';
  }

  //after we load page or add widget initialize needed filter too.
  private initializeUserDashboardFilters(): void {
    let allFilters: WidgetFilterOutput[] = [];

    this.dashboardDefinition.widgets
      .filter(widget => widget.filters != null && widget.filters.length > 0)
      .forEach(widget => {
        if (this.userDashboard.pages) {
          this.userDashboard.pages.forEach(page => {
            //if user has this widget in any page
            if (page.widgets.filter(userWidget => userWidget.id === widget.id).length !== 0) {
              widget.filters
                .forEach(filter => {
                  if (!allFilters.find(f => f.id === filter.id)) {
                    allFilters.push(filter);
                  }
                });
            }
          });
        }
      });

    this.userDashboard.filters = allFilters.map(filter => {
      let definition = this.getWidgetFilterViewDefinition(filter.id);
      definition['name'] = filter.name;
      return definition;
    });
  }

  subAsideTogglerClick() {
    abp.event.on('app.kt_aside_toggler.onClick', this.onMenuToggle);
  }

  unSubAsideTogglerClick() {
    abp.event.off('app.kt_aside_toggler.onClick', this.onMenuToggle);
  }

  onMenuToggle = () => {
    this.refreshAllGrids();
  }
}
