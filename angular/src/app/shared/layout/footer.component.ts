import { Component, Injector, OnInit, Input } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { ThemeAssetContributorFactory } from '@shared/helpers/ThemeAssetContributorFactory';

@Component({
    templateUrl: './footer.component.html',
    selector: 'footer-bar'
})
export class FooterComponent extends AppComponentBase implements OnInit {
    releaseDate: string;
    @Input() useBottomDiv = true;
    webAppGuiVersion: string;

    footerStyle = 'footer bg-white py-4 d-flex flex-lg-column';

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.releaseDate = this.appSession.application.releaseDate.format('YYYYMMDD');
        this.webAppGuiVersion = AppConsts.WebAppGuiVersion;

        let themeAssetContributor = ThemeAssetContributorFactory.getCurrent();
        if (themeAssetContributor) {
            this.footerStyle = themeAssetContributor.getFooterStyle();
        }
    }
}
