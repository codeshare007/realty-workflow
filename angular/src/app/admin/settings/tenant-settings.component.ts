import { IAjaxResponse, TokenService } from 'abp-ng2-module';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import {
    SettingScopes,
    SendTestEmailInput,
    TenantSettingsEditDto,
    TenantSettingsServiceProxy, JsonClaimMapDto
} from '@shared/service-proxies/service-proxies';
import { FileUploader, FileUploaderOptions } from 'ng2-file-upload';
import { finalize } from 'rxjs/operators';
import { KeyValueListManagerComponent } from '@app/shared/common/key-value-list-manager/key-value-list-manager.component';

@Component({
    templateUrl: './tenant-settings.component.html',
    animations: [appModuleAnimation()]
})
export class TenantSettingsComponent extends AppComponentBase implements OnInit {
    @ViewChild('wsFederationClaimsMappingManager') wsFederationClaimsMappingManager: KeyValueListManagerComponent;
    @ViewChild('openIdConnectClaimsMappingManager') openIdConnectClaimsMappingManager: KeyValueListManagerComponent;

    usingDefaultTimeZone = false;
    initialTimeZone: string = null;
    testEmailAddress: string = undefined;
    setRandomPassword: boolean;

    isMultiTenancyEnabled: boolean = this.multiTenancy.isEnabled;
    showTimezoneSelection: boolean = abp.clock.provider.supportsMultipleTimezone;
    activeTabIndex: number = (abp.clock.provider.supportsMultipleTimezone) ? 0 : 1;
    loading = false;
    settings: TenantSettingsEditDto = undefined;

    logoUploader: FileUploader;
    customCssUploader: FileUploader;

    remoteServiceBaseUrl = AppConsts.remoteServiceBaseUrl;

    defaultTimezoneScope: SettingScopes = SettingScopes.Tenant;

    enabledSocialLoginSettings: string[];
    useFacebookHostSettings: boolean;
    useGoogleHostSettings: boolean;
    useMicrosoftHostSettings: boolean;
    useWsFederationHostSettings: boolean;
    useOpenIdConnectHostSettings: boolean;

    wsFederationClaimMappings: { key: string, value: string }[];
    openIdConnectClaimMappings: { key: string, value: string }[];

    constructor(
        injector: Injector,
        private _tenantSettingsService: TenantSettingsServiceProxy,
        private _tokenService: TokenService
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.testEmailAddress = this.appSession.user.emailAddress;
        this.getSettings();
        this.initUploaders();
        this.loadSocialLoginSettings();
    }

    getSettings(): void {
        this.loading = true;
        this._tenantSettingsService.getAllSettings()
            .pipe(finalize(() => {
                this.loading = false;
            }))
            .subscribe((result: TenantSettingsEditDto) => {
                this.settings = result;
                if (this.settings.general) {
                    this.initialTimeZone = this.settings.general.timezone;
                    this.usingDefaultTimeZone = this.settings.general.timezoneForComparison === abp.setting.values['Abp.Timing.TimeZone'];
                }
                this.useFacebookHostSettings = !this.settings.externalLoginProviderSettings.facebook.appId;
                this.useGoogleHostSettings = !this.settings.externalLoginProviderSettings.google.clientId;
                this.useMicrosoftHostSettings = !this.settings.externalLoginProviderSettings.microsoft.clientId;
                this.useWsFederationHostSettings = !this.settings.externalLoginProviderSettings.wsFederation.clientId;
                this.useOpenIdConnectHostSettings = !this.settings.externalLoginProviderSettings.openIdConnect.clientId;

                this.wsFederationClaimMappings = this.settings.externalLoginProviderSettings.openIdConnectClaimsMapping
                    .map(item => {
                        return {
                            key: item.key,
                            value: item.claim
                        };
                    });

                this.openIdConnectClaimMappings = this.settings.externalLoginProviderSettings.openIdConnectClaimsMapping
                    .map(item => {
                        return {
                            key: item.key,
                            value: item.claim
                        };
                    });
            });
    }

    initUploaders(): void {
        this.logoUploader = this.createUploader(
            '/TenantCustomization/UploadLogo',
            result => {
                this.appSession.tenant.logoFileType = result.fileType;
                this.appSession.tenant.logoId = result.id;
            }
        );

        this.customCssUploader = this.createUploader(
            '/TenantCustomization/UploadCustomCss',
            result => {
                this.appSession.tenant.customCssId = result.id;

                let oldTenantCustomCss = document.getElementById('TenantCustomCss');
                if (oldTenantCustomCss) {
                    oldTenantCustomCss.remove();
                }

                let tenantCustomCss = document.createElement('link');
                tenantCustomCss.setAttribute('id', 'TenantCustomCss');
                tenantCustomCss.setAttribute('rel', 'stylesheet');
                tenantCustomCss.setAttribute('href', AppConsts.remoteServiceBaseUrl + '/TenantCustomization/GetCustomCss?tenantId=' + this.appSession.tenant.id);
                document.head.appendChild(tenantCustomCss);
            }
        );
    }

    createUploader(url: string, success?: (result: any) => void): FileUploader {
        const uploader = new FileUploader({ url: AppConsts.remoteServiceBaseUrl + url });

        uploader.onAfterAddingFile = (file) => {
            file.withCredentials = false;
        };

        uploader.onSuccessItem = (item, response, status) => {
            const ajaxResponse = <IAjaxResponse>JSON.parse(response);
            if (ajaxResponse.success) {
                this.notify.info(this.l('SavedSuccessfully'));
                if (success) {
                    success(ajaxResponse.result);
                }
            } else {
                this.message.error(ajaxResponse.error.message);
            }
        };

        const uploaderOptions: FileUploaderOptions = {};
        uploaderOptions.authToken = 'Bearer ' + this._tokenService.getToken();
        uploaderOptions.removeAfterUpload = true;
        uploader.setOptions(uploaderOptions);
        return uploader;
    }

    uploadLogo(): void {
        this.logoUploader.uploadAll();
    }

    uploadCustomCss(): void {
        this.customCssUploader.uploadAll();
    }

    clearLogo(): void {
        this._tenantSettingsService.clearLogo().subscribe(() => {
            this.appSession.tenant.logoFileType = null;
            this.appSession.tenant.logoId = null;
            this.notify.info(this.l('ClearedSuccessfully'));
        });
    }

    clearCustomCss(): void {
        this._tenantSettingsService.clearCustomCss().subscribe(() => {
            this.appSession.tenant.customCssId = null;

            let oldTenantCustomCss = document.getElementById('TenantCustomCss');
            if (oldTenantCustomCss) {
                oldTenantCustomCss.remove();
            }

            this.notify.info(this.l('ClearedSuccessfully'));
        });
    }

    mapClaims(): void {
        if (this.wsFederationClaimsMappingManager) {
            this.settings.externalLoginProviderSettings.wsFederationClaimsMapping = this.wsFederationClaimsMappingManager.getItems()
                .map(item =>
                    new JsonClaimMapDto({
                        key: item.key,
                        claim: item.value
                    })
                );
        }

        if (this.openIdConnectClaimsMappingManager) {
            this.settings.externalLoginProviderSettings.openIdConnectClaimsMapping = this.openIdConnectClaimsMappingManager.getItems()
                .map(item =>
                    new JsonClaimMapDto({
                        key: item.key,
                        claim: item.value
                    })
                );
        }
    }

    saveAll(): void {
        this.mapClaims();
        this._tenantSettingsService.updateAllSettings(this.settings).subscribe(() => {
            this.notify.info(this.l('SavedSuccessfully'));

            if (abp.clock.provider.supportsMultipleTimezone && this.usingDefaultTimeZone && this.initialTimeZone !== this.settings.general.timezone) {
                this.message.info(this.l('TimeZoneSettingChangedRefreshPageNotification')).then(() => {
                    window.location.reload();
                });
            }
        });
    }

    sendTestEmail(): void {
        const input = new SendTestEmailInput();
        input.emailAddress = this.testEmailAddress;
        this._tenantSettingsService.sendTestEmail(input).subscribe(result => {
            this.notify.info(this.l('TestEmailSentSuccessfully'));
        });
    }

    loadSocialLoginSettings(): void {
        const self = this;
        this._tenantSettingsService.getEnabledSocialLoginSettings()
            .subscribe(setting => {
                self.enabledSocialLoginSettings = setting.enabledSocialLoginSettings;
            });
    }

    clearFacebookSettings(): void {
        this.settings.externalLoginProviderSettings.facebook.appId = '';
        this.settings.externalLoginProviderSettings.facebook.appSecret = '';
    }

    clearGoogleSettings(): void {
        this.settings.externalLoginProviderSettings.google.clientId = '';
        this.settings.externalLoginProviderSettings.google.clientSecret = '';
        this.settings.externalLoginProviderSettings.google.userInfoEndpoint = '';
    }

    clearMicrosoftSettings(): void {
        this.settings.externalLoginProviderSettings.microsoft.clientId = '';
        this.settings.externalLoginProviderSettings.microsoft.clientSecret = '';
    }

    clearWsFederationSettings(): void {
        this.settings.externalLoginProviderSettings.wsFederation.clientId = '';
        this.settings.externalLoginProviderSettings.wsFederation.authority = '';
        this.settings.externalLoginProviderSettings.wsFederation.wtrealm = '';
        this.settings.externalLoginProviderSettings.wsFederation.metaDataAddress = '';
        this.settings.externalLoginProviderSettings.wsFederation.tenant = '';
        this.settings.externalLoginProviderSettings.wsFederationClaimsMapping = [];
    }

    clearOpenIdSettings(): void {
        this.settings.externalLoginProviderSettings.openIdConnect.clientId = '';
        this.settings.externalLoginProviderSettings.openIdConnect.clientSecret = '';
        this.settings.externalLoginProviderSettings.openIdConnect.authority = '';
        this.settings.externalLoginProviderSettings.openIdConnect.loginUrl = '';
        this.settings.externalLoginProviderSettings.openIdConnectClaimsMapping = [];
    }
}
