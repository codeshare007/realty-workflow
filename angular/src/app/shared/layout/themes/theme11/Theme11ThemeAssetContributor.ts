import { IThemeAssetContributor } from '../ThemeAssetContributor';

export class Theme11ThemeAssetContributor implements IThemeAssetContributor {
    public getAssetUrls(): string[] {
        return [''];
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
        return 'footer py-4 d-flex flex-lg-column ';
    }
}
