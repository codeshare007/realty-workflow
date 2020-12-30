///<reference path="../node_modules/abp-web-resources/Abp/Framework/scripts/abp.d.ts"/>
///<reference path="../node_modules/abp-web-resources/Abp/Framework/scripts/libs/abp.jquery.d.ts"/>
///<reference path="../node_modules/abp-web-resources/Abp/Framework/scripts/libs/abp.signalr.d.ts"/>
///<reference path="../node_modules/moment/moment.d.ts"/>
///<reference path="../node_modules/@types/moment-timezone/index.d.ts"/>

// Typings reference file, see links for more information
// https://github.com/typings/typings
// https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html

declare var System: any;

declare var KTOffcanvas: any; // Related to Metronic
declare var KTMenu: any; // Related to Metronic
declare var KTToggle: any; // Related to Metronic
declare var KTUtil: any; // Related to Metronic
declare var KTHeader: any; // Related to Metronic
declare var KTScrolltop: any; // Related to Metronic
declare var StripeCheckout: any;

declare namespace abp {
    namespace ui {
        function setBusy(elm?: any, text?: any, optionsOrPromise?: any): void;
    }
}

/**
 * rtl-detect
 */

declare module 'rtl-detect';
