import { browser, element, by, protractor, ExpectedConditions as EC } from 'protractor';

export class RealtyPage {
    navigateTo() {
        return browser.get('/');
    }

    async getUsername() {
        return (await element(by.css('.topbar-username')).getText()).replace('\n', '');
    }

    async getTenancyName() {
        return await element(by.css('.tenancy-name')).getText();
    }

    async waitForItemToBeVisible(element) {
        await browser.wait(EC.visibilityOf(element));
    }

    async loginAsHostAdmin() {
        let username = element(by.name('userNameOrEmailAddress'));
        let password = element(by.name('password'));

        await browser.get('/account/login');
        await this.waitForItemToBeVisible(username);

        await username.sendKeys('admin');
        await password.sendKeys('123qwe');
        await element(by.className('form')).submit();
    }

    async loginAsTenantAdmin() {
        let username = element(by.name('userNameOrEmailAddress'));
        let password = element(by.name('password'));
        let tenantChangeBox = element(by.css('.tenant-change-box'));

        await browser.get('/account/login');

        // open tenant change dialog
        await this.waitForItemToBeVisible(tenantChangeBox);
        await tenantChangeBox.element(by.tagName('a')).click();

        await browser.sleep(1000);

        // select default Tenant
        await tenantChangeBox.element(by.className('switch')).click();
        let tenancyName = element(by.id('tenancyNameInput'));
        await this.waitForItemToBeVisible(tenancyName);
        await tenancyName.sendKeys('Default');
        await tenantChangeBox.element(by.css('.save-button')).click();

        await browser.sleep(1000);

        await browser.get('/account/login');
        await this.waitForItemToBeVisible(username);

        await username.sendKeys('admin');
        await password.sendKeys('123qwe');
        await element(by.className('form')).submit();
    }
}
