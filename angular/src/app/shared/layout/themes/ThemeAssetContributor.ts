export interface IThemeAssetContributor {
    getAssetUrls(): string[];
    getAdditionalBodyStle(): string;
    getMenuWrapperStyle(): string;
    getFooterStyle(): string;
}
