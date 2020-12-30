export class ThemeHelper {

    public static getTheme(): string {
        return abp.setting.get('App.UiManagement.Theme');
    }

    public static getAsideSkin(): string {
        return abp.setting.get(ThemeHelper.getTheme() + '.App.UiManagement.Left.AsideSkin');
    }

    public static getHeaderSkin(): string {
        return abp.setting.get(ThemeHelper.getTheme() + '.App.UiManagement.Header.Skin');
    }
}
