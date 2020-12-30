import { IThemeAssetContributor } from '@app/shared/layout/themes/ThemeAssetContributor';
import { ThemeHelper } from '@app/shared/layout/themes/ThemeHelper';
import { DefaultThemeAssetContributor } from '@app/shared/layout/themes/default/DefaultThemeAssetContributor';
import { Theme8ThemeAssetContributor } from '@app/shared/layout/themes/theme8/Theme8ThemeAssetContributor';
import { Theme2ThemeAssetContributor } from '@app/shared/layout/themes/theme2/Theme2ThemeAssetContributor';
import { Theme11ThemeAssetContributor } from '@app/shared/layout/themes/theme11/Theme11ThemeAssetContributor';
import { Theme10ThemeAssetContributor } from '@app/shared/layout/themes/theme10/Theme10ThemeAssetContributor';
import { Theme9ThemeAssetContributor } from '@app/shared/layout/themes/theme9/Theme9ThemeAssetContributor';
import { Theme7ThemeAssetContributor } from '@app/shared/layout/themes/theme7/Theme7ThemeAssetContributor';
import { Theme6ThemeAssetContributor } from '@app/shared/layout/themes/theme6/Theme6ThemeAssetContributor';
import { Theme5ThemeAssetContributor } from '@app/shared/layout/themes/theme5/Theme5ThemeAssetContributor';
import { Theme4ThemeAssetContributor } from '@app/shared/layout/themes/theme4/Theme4ThemeAssetContributor';
import { Theme3ThemeAssetContributor } from '@app/shared/layout/themes/theme3/Theme3ThemeAssetContributor';

export class ThemeAssetContributorFactory {
    static getCurrent(): IThemeAssetContributor {
        let theme = ThemeHelper.getTheme();

        if (theme === 'default') {
            return new DefaultThemeAssetContributor();
        }

        if (theme === 'theme2') {
            return new Theme2ThemeAssetContributor();
        }

        if (theme === 'theme3') {
            return new Theme3ThemeAssetContributor();
        }

        if (theme === 'theme4') {
            return new Theme4ThemeAssetContributor();
        }

        if (theme === 'theme5') {
            return new Theme5ThemeAssetContributor();
        }

        if (theme === 'theme6') {
            return new Theme6ThemeAssetContributor();
        }

        if (theme === 'theme7') {
            return new Theme7ThemeAssetContributor();
        }

        if (theme === 'theme8') {
            return new Theme8ThemeAssetContributor();
        }

        if (theme === 'theme9') {
            return new Theme9ThemeAssetContributor();
        }

        if (theme === 'theme10') {
            return new Theme10ThemeAssetContributor();
        }

        if (theme === 'theme11') {
            return new Theme11ThemeAssetContributor();
        }

        return null;
    }
}
