import { IThemeAssetContributor } from '../ThemeAssetContributor';
import { AppConsts } from '@shared/AppConsts';

export class Theme5ThemeAssetContributor implements IThemeAssetContributor {
    public getAssetUrls(): string[] {
        return [AppConsts.appBaseUrl + '/assets/fonts/fonts-asap-condensed.min.css'];
    }

    public getAdditionalBodyStle(): string {
        return '';
    }

    public getMenuWrapperStyle(): string {
        return '';
    }

    public getSubheaderStyle(): string {
        return 'subheader-title text-dark font-weight-bold my-1 mr-3';
    }

    public getFooterStyle(): string {
        return 'footer bg-white py-4 d-flex flex-lg-column';
    }
}
