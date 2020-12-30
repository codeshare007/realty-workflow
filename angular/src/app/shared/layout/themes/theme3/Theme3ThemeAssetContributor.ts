import { IThemeAssetContributor } from '../ThemeAssetContributor';
import { AppConsts } from '@shared/AppConsts';

export class Theme3ThemeAssetContributor implements IThemeAssetContributor {
    public getAssetUrls(): string[] {
        return [AppConsts.appBaseUrl + '/assets/fonts/fonts-montserrat.min.css'];
    }

    public getAdditionalBodyStle(): string {
        return 'aside-secondary-enabled';
    }

    public getMenuWrapperStyle(): string {
        return '';
    }

    public getSubheaderStyle(): string {
        return 'subheader-title text-dark font-weight-bold my-1 mr-3';
    }

    public getFooterStyle(): string {
        return 'footer py-4 d-flex flex-lg-column';
    }
}
