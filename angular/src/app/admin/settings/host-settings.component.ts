import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import {
    ComboboxItemDto,
    CommonLookupServiceProxy,
    SettingScopes,
    HostSettingsEditDto,
    HostSettingsServiceProxy,
    SendTestEmailInput,
    JsonClaimMapDto
} from '@shared/service-proxies/service-proxies';
import { KeyValueListManagerComponent } from '@app/shared/common/key-value-list-manager/key-value-list-manager.component';

@Component({
    templateUrl: './host-settings.component.html',
    animations: [appModuleAnimation()]
})
export class HostSettingsComponent extends AppComponentBase implements OnInit {
    @ViewChild('wsFederationClaimsMappingManager') wsFederationClaimsMappingManager: KeyValueListManagerComponent;
    @ViewChild('openIdConnectClaimsMappingManager') openIdConnectClaimsMappingManager: KeyValueListManagerComponent;

    loading = false;
    hostSettings: HostSettingsEditDto;
    editions: ComboboxItemDto[] = undefined;
    testEmailAddress: string = undefined;
    showTimezoneSelection = abp.clock.provider.supportsMultipleTimezone;
    defaultTimezoneScope: SettingScopes = SettingScopes.Application;

    usingDefaultTimeZone = false;
    initialTimeZone: string = undefined;

    enabledSocialLoginSettings: string[];

    wsFederationClaimMappings: { key: string, value: string }[];
    openIdConnectClaimMappings: { key: string, value: string }[];

    constructor(
        injector: Injector,
        private _hostSettingService: HostSettingsServiceProxy,
        private _commonLookupService: CommonLookupServiceProxy
    ) {
        super(injector);
    }

    loadHostSettings(): void {
        const self = this;
        self._hostSettingService.getAllSettings()
            .subscribe(setting => {
                self.hostSettings = setting;
                self.initialTimeZone = setting.general.timezone;
                self.usingDefaultTimeZone = setting.general.timezoneForComparison === self.setting.get('Abp.Timing.TimeZone');

                this.wsFederationClaimMappings = this.hostSettings.externalLoginProviderSettings.openIdConnectClaimsMapping
                    .map(item => {
                        return {
                            key: item.key,
                            value: item.claim
                        };
                    });
                this.openIdConnectClaimMappings = this.hostSettings.externalLoginProviderSettings.openIdConnectClaimsMapping
                    .map(item => {
                        return {
                            key: item.key,
                            value: item.claim
                        };
                    });
            });
    }

    loadEditions(): void {
        const self = this;
        self._commonLookupService.getEditionsForCombobox(false).subscribe((result) => {
            self.editions = result.items;

            const notAssignedEdition = new ComboboxItemDto();
            notAssignedEdition.value = null;
            notAssignedEdition.displayText = self.l('NotAssigned');

            self.editions.unshift(notAssignedEdition);
        });
    }

    init(): void {
        const self = this;
        self.testEmailAddress = self.appSession.user.emailAddress;
        self.showTimezoneSelection = abp.clock.provider.supportsMultipleTimezone;
        self.loadHostSettings();
        self.loadEditions();
        self.loadSocialLoginSettings();
    }

    ngOnInit(): void {
        const self = this;
        self.init();
    }

    sendTestEmail(): void {
        const self = this;
        const input = new SendTestEmailInput();
        input.emailAddress = self.testEmailAddress;
        self._hostSettingService.sendTestEmail(input).subscribe(result => {
            self.notify.info(self.l('TestEmailSentSuccessfully'));
        });
    }

    mapClaims(): void {
        if (this.wsFederationClaimsMappingManager) {
            this.hostSettings.externalLoginProviderSettings.wsFederationClaimsMapping = this.wsFederationClaimsMappingManager.getItems()
                .map(item =>
                    new JsonClaimMapDto({
                        key: item.key,
                        claim: item.value
                    })
                );
        }

        if (this.openIdConnectClaimsMappingManager) {
            this.hostSettings.externalLoginProviderSettings.openIdConnectClaimsMapping = this.openIdConnectClaimsMappingManager.getItems()
                .map(item =>
                    new JsonClaimMapDto({
                        key: item.key,
                        claim: item.value
                    })
                );
        }
    }

    saveAll(): void {

        const self = this;

        self.mapClaims();
        if (!self.hostSettings.tenantManagement.defaultEditionId || self.hostSettings.tenantManagement.defaultEditionId.toString() === 'null') {
            self.hostSettings.tenantManagement.defaultEditionId = null;
        }

        self._hostSettingService.updateAllSettings(self.hostSettings).subscribe(result => {
            self.notify.info(self.l('SavedSuccessfully'));

            if (abp.clock.provider.supportsMultipleTimezone && self.usingDefaultTimeZone && self.initialTimeZone !== self.hostSettings.general.timezone) {
                self.message.info(self.l('TimeZoneSettingChangedRefreshPageNotification')).then(() => {
                    window.location.reload();
                });
            }
        });
    }

    loadSocialLoginSettings(): void {
        const self = this;
        this._hostSettingService.getEnabledSocialLoginSettings()
            .subscribe(setting => {
                self.enabledSocialLoginSettings = setting.enabledSocialLoginSettings;
            });
    }
}
