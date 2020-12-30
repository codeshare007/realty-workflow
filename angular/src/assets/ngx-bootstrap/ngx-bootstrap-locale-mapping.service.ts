export class NgxBootstrapLocaleMappingService {
    map(locale: string): string {
        const cultureMap = {
            'zh-Hans': 'zh-cn',
            'es-MX': 'es',
            'vi': 'en-gb'
            // Add more here
        };

        if (locale === 'en' || locale.startsWith('en-')) {
            return 'en-gb';
        }

        if (cultureMap[locale]) {
            return cultureMap[locale];
        }

        return locale;
    }

    getModuleName(locale: string): string {
        const moduleNameMap = {
            'zh-Hans': 'zhCn',
            'es-MX': 'es',
            'pt-BR': 'ptBr',
            'vi': 'enGb'
            // Add more here
        };

        if (locale === 'en' || locale.startsWith('en-')) {
            return 'enGb';
        }

        if (moduleNameMap[locale]) {
            return moduleNameMap[locale];
        }

        return locale;
    }
}
