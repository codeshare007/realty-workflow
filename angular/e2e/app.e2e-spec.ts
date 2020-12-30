import { RealtyPage } from './app.po';
import { browser, element, by } from 'protractor';

describe('abp-zero-template App', () => {
    let page: RealtyPage;

    beforeEach(() => {
        page = new RealtyPage();

        browser.driver.manage().deleteAllCookies();

        // Disable waitForAngularEnabled, otherwise test browser will be closed immediately
        browser.waitForAngularEnabled(false);
    });

    it('should login as host admin', async () => {
        // To make username div visible. It is not visible in small size screens
        browser.driver.manage().window().setSize(1200, 1000);

        await page.loginAsHostAdmin();

        await page.waitForItemToBeVisible(element(by.id('kt_quick_user_toggle')));
        await element(by.id('kt_quick_user_toggle')).click();
        await page.waitForItemToBeVisible(element(by.css('.topbar-username')));

        let username = await page.getUsername();
        expect(username.toUpperCase()).toEqual('\\ADMIN');

        let tenancyName = await page.getTenancyName();
        expect(tenancyName).toEqual('\\');
    });

    it('should login as default tenant admin', async () => {
        // To make username div visible. It is not visible in small size screens
        browser.driver.manage().window().setSize(1200, 1000);

        await page.loginAsTenantAdmin();

        await page.waitForItemToBeVisible(element(by.id('kt_quick_user_toggle')));
        await element(by.id('kt_quick_user_toggle')).click();
        await page.waitForItemToBeVisible(element(by.css('.topbar-username')));

        let username = await page.getUsername();
        expect(username.toUpperCase()).toEqual('DEFAULT\\ADMIN');

        let tenancyName = await page.getTenancyName();
        expect(tenancyName.toLocaleLowerCase()).toEqual('default\\');
    });
});
