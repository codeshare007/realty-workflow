import { IThemeAssetContributor } from '../ThemeAssetContributor';
import { AppConsts } from '@shared/AppConsts';

export class Theme7ThemeAssetContributor implements IThemeAssetContributor {
    public getAssetUrls(): string[] {
        return [AppConsts.appBaseUrl + '/assets/fonts/fonts-montserrat.min.css'];
    }

    public getAdditionalBodyStle(): string {
        return '';
    }

    public getMenuWrapperStyle(): string {
        return '';
    }

    public getSubheaderStyle(): string {
        return 'text-dark font-weight-bold my-1 mr-5';
    }

    public getFooterStyle(): string {
        return 'footer bg-white py-4 d-flex flex-lg-column';
    }
}
