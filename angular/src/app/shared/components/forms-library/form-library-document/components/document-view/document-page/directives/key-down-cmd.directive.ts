import { Directive, HostListener } from '@angular/core';
import { MacKeysService } from '../services/mac-keys.service';

@Directive({
    selector: '[keyDownCmd]'
})
export class KeyDownCmdDirective {

    constructor(
        private _macKeysService: MacKeysService,
    ) { }

    @HostListener('document:keydown', ['$event'])
    keydownCmd(event: KeyboardEvent) {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        let info, webkit, mozilla, opera, kC;
        if (isMac) {
            info = this._getBrouserInfo();
            webkit = (info.browser === 'Chrome' || info.browser === 'Safari');
            mozilla = info.browser === 'Firefox';
            opera = info.browser === 'Opera';
            kC = event.keyCode;
            if (((webkit || opera) && (kC === 91 || kC === 93)) || (mozilla && kC === 224)) {
                this._macKeysService.macKeys.cmdKey = true;
            } else if (kC === 17) {
                this._macKeysService. macKeys.ctrlKey = true;
            }
        }
    }

    @HostListener('document:keyup', ['$event'])
    keyupCmd(event: KeyboardEvent) {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        let info, webkit, mozilla, opera, kC;
        if (isMac) {
            info = this._getBrouserInfo();
            webkit = (info.browser === 'Chrome' || info.browser === 'Safari');
            mozilla = info.browser === 'Firefox';
            opera = info.browser === 'Opera';
            kC = +event.keyCode;
            if (((webkit || opera) && (kC === 91 || kC === 93)) || (mozilla && kC === 224)) {
                this._macKeysService.macKeys.cmdKey = false;
            } else if (kC === 17) {
                this._macKeysService.macKeys.ctrlKey = false;
            }
        }
    }

    private _getBrouserInfo(): any {
        let ua = navigator.userAgent,
            tem,
            M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return {
                'browser': 'IE',
                'version': (tem[1] || '')
            };
        }
        if (M[1] === 'Chrome') {
            tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
            if (tem != null) {
                return {
                    'browser': tem.slice(1)[0].replace('OPR', 'Opera'),
                    'version': tem.slice(1)[1]
                };
            }
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) {
            M.splice(1, 1, tem[1]);
        }

        return {
            'browser': M[0],
            'version': M[1]
        };
    }
}
