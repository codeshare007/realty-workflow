/* tslint:disable:no-unused-variable */

import { APP_BASE_HREF } from '@angular/common';
import { TestBed, async } from '@angular/core/testing';
import { API_BASE_URL } from '@shared/service-proxies/service-proxies';
import { RootModule } from '../root.module';
import { AppComponent } from './app.component';
import { LOCALE_ID } from '@angular/core';

export function getRemoteServiceBaseUrl(): string {
    return 'https://localhost:44301';
}

describe('App: Realty', () => {

    // Remove freezeui loading animation
    (window as any).FreezeUI = function () { };
    (window as any).UnFreezeUI = function () { };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RootModule
            ],
            providers: [
                { provide: API_BASE_URL, useValue: getRemoteServiceBaseUrl() },
                { provide: APP_BASE_HREF, useValue: '/' },
                { provide: LOCALE_ID, useValue: 'en' }
            ]
        }).compileComponents();
    }));

    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
});
