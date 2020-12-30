import { CompilerOptions, NgModuleRef, Type } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppAuthService } from '@app/shared/common/auth/app-auth.service';
import { AppConsts } from '@shared/AppConsts';
import { SubdomainTenancyNameFinder } from '@shared/helpers/SubdomainTenancyNameFinder';
import * as moment from 'moment';
import * as _ from 'lodash';
import { UrlHelper } from './shared/helpers/UrlHelper';
import { XmlHttpRequestHelper } from '@shared/helpers/XmlHttpRequestHelper';
import { DynamicResourcesHelper } from '@shared/helpers/DynamicResourcesHelper';
import { environment } from './environments/environment';
import { LocaleMappingService } from '@shared/locale-mapping.service';
import { LocalStorageService } from '@shared/utils/local-storage.service';

export class AppPreBootstrap {

    static run(appRootUrl: string, callback: () => void, resolve: any, reject: any): void {
        AppPreBootstrap.getApplicationConfig(appRootUrl, () => {
            if (UrlHelper.isInstallUrl(location.href)) {
                AppPreBootstrap.loadAssetsForInstallPage(callback);
                return;
            }

            const queryStringObj = UrlHelper.getQueryParameters();

            if (queryStringObj.redirect && queryStringObj.redirect === 'TenantRegistration') {
                if (queryStringObj.forceNewRegistration) {
                    new AppAuthService().logout();
                }

                location.href = AppConsts.appBaseUrl + '/account/select-edition';
            } else if (queryStringObj.impersonationToken) {
                if (queryStringObj.userDelegationId) {
                    AppPreBootstrap.delegatedImpersonatedAuthenticate(queryStringObj.userDelegationId, queryStringObj.impersonationToken, queryStringObj.tenantId, () => { AppPreBootstrap.getUserConfiguration(callback); });
                } else {
                    AppPreBootstrap.impersonatedAuthenticate(queryStringObj.impersonationToken, queryStringObj.tenantId, () => { AppPreBootstrap.getUserConfiguration(callback); });
                }
            } else if (queryStringObj.switchAccountToken) {
                AppPreBootstrap.linkedAccountAuthenticate(queryStringObj.switchAccountToken, queryStringObj.tenantId, () => { AppPreBootstrap.getUserConfiguration(callback); });
            } else {
                AppPreBootstrap.getUserConfiguration(callback);
            }
        });
    }

    static bootstrap<TM>(moduleType: Type<TM>, compilerOptions?: CompilerOptions | CompilerOptions[]): Promise<NgModuleRef<TM>> {
        return platformBrowserDynamic().bootstrapModule(moduleType, compilerOptions);
    }

    private static getApplicationConfig(appRootUrl: string, callback: () => void) {
        let type = 'GET';
        let url = appRootUrl + 'assets/' + environment.appConfig;
        let customHeaders = [
            {
                name: abp.multiTenancy.tenantIdCookieName,
                value: abp.multiTenancy.getTenantIdCookie() + ''
            }];

        XmlHttpRequestHelper.ajax(type, url, customHeaders, null, (result) => {
            const subdomainTenancyNameFinder = new SubdomainTenancyNameFinder();
            const tenancyName = subdomainTenancyNameFinder.getCurrentTenancyNameOrNull(result.appBaseUrl);

            AppConsts.appBaseUrlFormat = result.appBaseUrl;
            AppConsts.remoteServiceBaseUrlFormat = result.remoteServiceBaseUrl;
            AppConsts.localeMappings = result.localeMappings;

            if (tenancyName == null) {
                AppConsts.appBaseUrl = result.appBaseUrl.replace(AppConsts.tenancyNamePlaceHolderInUrl + '.', '');
                AppConsts.remoteServiceBaseUrl = result.remoteServiceBaseUrl.replace(AppConsts.tenancyNamePlaceHolderInUrl + '.', '');
            } else {
                AppConsts.appBaseUrl = result.appBaseUrl.replace(AppConsts.tenancyNamePlaceHolderInUrl, tenancyName);
                AppConsts.remoteServiceBaseUrl = result.remoteServiceBaseUrl.replace(AppConsts.tenancyNamePlaceHolderInUrl, tenancyName);
            }

            callback();
        });
    }

    private static getCurrentClockProvider(currentProviderName: string): abp.timing.IClockProvider {
        if (currentProviderName === 'unspecifiedClockProvider') {
            return abp.timing.unspecifiedClockProvider;
        }

        if (currentProviderName === 'utcClockProvider') {
            return abp.timing.utcClockProvider;
        }

        return abp.timing.localClockProvider;
    }

    private static getRequetHeadersWithDefaultValues() {
        const cookieLangValue = abp.utils.getCookieValue('Abp.Localization.CultureName');

        let requestHeaders = {
            '.AspNetCore.Culture': ('c=' + cookieLangValue + '|uic=' + cookieLangValue),
            [abp.multiTenancy.tenantIdCookieName]: abp.multiTenancy.getTenantIdCookie()
        };

        if (!cookieLangValue) {
            delete requestHeaders['.AspNetCore.Culture'];
        }

        return requestHeaders;
    }

    private static impersonatedAuthenticate(impersonationToken: string, tenantId: number, callback: () => void): void {
        abp.multiTenancy.setTenantIdCookie(tenantId);
        let requestHeaders = AppPreBootstrap.getRequetHeadersWithDefaultValues();

        XmlHttpRequestHelper.ajax(
            'POST',
            AppConsts.remoteServiceBaseUrl + '/api/TokenAuth/ImpersonatedAuthenticate?impersonationToken=' + impersonationToken,
            requestHeaders,
            null,
            (response) => {
                let result = response.result;
                abp.auth.setToken(result.accessToken);
                AppPreBootstrap.setEncryptedTokenCookie(result.encryptedAccessToken);
                location.search = '';
                callback();
            }
        );
    }

    private static delegatedImpersonatedAuthenticate(userDelegationId: number, impersonationToken: string, tenantId: number, callback: () => void): void {
        abp.multiTenancy.setTenantIdCookie(tenantId);
        let requestHeaders = AppPreBootstrap.getRequetHeadersWithDefaultValues();

        XmlHttpRequestHelper.ajax(
            'POST',
            AppConsts.remoteServiceBaseUrl + '/api/TokenAuth/DelegatedImpersonatedAuthenticate?userDelegationId=' + userDelegationId + '&impersonationToken=' + impersonationToken,
            requestHeaders,
            null,
            (response) => {
                let result = response.result;
                abp.auth.setToken(result.accessToken);
                AppPreBootstrap.setEncryptedTokenCookie(result.encryptedAccessToken);
                location.search = '';
                callback();
            }
        );
    }

    private static linkedAccountAuthenticate(switchAccountToken: string, tenantId: number, callback: () => void): void {
        abp.multiTenancy.setTenantIdCookie(tenantId);
        let requestHeaders = AppPreBootstrap.getRequetHeadersWithDefaultValues();

        XmlHttpRequestHelper.ajax(
            'POST',
            AppConsts.remoteServiceBaseUrl + '/api/TokenAuth/LinkedAccountAuthenticate?switchAccountToken=' + switchAccountToken,
            requestHeaders,
            null,
            (response) => {
                let result = response.result;
                abp.auth.setToken(result.accessToken);
                AppPreBootstrap.setEncryptedTokenCookie(result.encryptedAccessToken);
                location.search = '';
                callback();
            }
        );
    }

    private static getUserConfiguration(callback: () => void): any {
        const token = abp.auth.getToken();

        let requestHeaders = AppPreBootstrap.getRequetHeadersWithDefaultValues();

        if (token) {
            requestHeaders['Authorization'] = 'Bearer ' + token;
        }

        return XmlHttpRequestHelper.ajax('GET', AppConsts.remoteServiceBaseUrl + '/AbpUserConfiguration/GetAll', requestHeaders, null, (response) => {
            let result = response.result;

            _.merge(abp, result);

            abp.clock.provider = this.getCurrentClockProvider(result.clock.provider);

            AppPreBootstrap.configureMoment();

            abp.event.trigger('abp.dynamicScriptsInitialized');

            AppConsts.recaptchaSiteKey = abp.setting.get('Recaptcha.SiteKey');
            AppConsts.subscriptionExpireNootifyDayCount = parseInt(abp.setting.get('App.TenantManagement.SubscriptionExpireNotifyDayCount'));

            DynamicResourcesHelper.loadResources(callback);
        });
    }

    private static configureMoment() {
        moment.locale(new LocaleMappingService().map('moment', abp.localization.currentLanguage.name));
        (window as any).moment.locale(new LocaleMappingService().map('moment', abp.localization.currentLanguage.name));

        if (abp.clock.provider.supportsMultipleTimezone) {
            moment.tz.setDefault(abp.timing.timeZoneInfo.iana.timeZoneId);
            (window as any).moment.tz.setDefault(abp.timing.timeZoneInfo.iana.timeZoneId);
        } else {
            Date.prototype.toISOString = function () {
                return moment(this).locale('en').format();
            };
            moment.fn.toJSON = function () {
                return this.locale('en').format();
            };
            moment.fn.toISOString = function () {
                return this.locale('en').format();
            };
        }
    }

    private static setEncryptedTokenCookie(encryptedToken: string) {
        new LocalStorageService().setItem(AppConsts.authorization.encrptedAuthTokenName,
            {
                token: encryptedToken,
                expireDate: new Date(new Date().getTime() + 365 * 86400000), //1 year
            });
    }

    private static loadAssetsForInstallPage(callback) {
        abp.setting.values['App.UiManagement.Theme'] = 'default';
        abp.setting.values['default.App.UiManagement.ThemeColor'] = 'default';

        DynamicResourcesHelper.loadResources(callback);
    }
}
