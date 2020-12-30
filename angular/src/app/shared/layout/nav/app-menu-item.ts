export class AppMenuItem {
    name = '';
    permissionName = '';
    icon = '';
    route = '';
    routeTemplates = [];
    items: AppMenuItem[];
    external: boolean;
    requiresAuthentication: boolean;
    featureDependency: any;
    parameters: {};

    constructor(
        name: string,
        permissionName: string,
        icon: string,
        route: string,
        routeTemplates?: string[],
        items?: AppMenuItem[],
        external?: boolean,
        parameters?: Object,
        featureDependency?: any,
        requiresAuthentication?: boolean
    ) {
        this.name = name;
        this.permissionName = permissionName;
        this.icon = icon;
        this.route = route;
        this.routeTemplates = routeTemplates;
        this.external = external;
        this.parameters = parameters;
        this.featureDependency = featureDependency;

        if (items === undefined) {
            this.items = [];
        } else {
            this.items = items;
        }

        if (this.permissionName) {
            this.requiresAuthentication = true;
        } else {
            this.requiresAuthentication = requiresAuthentication ? requiresAuthentication : false;
        }
    }

    hasFeatureDependency(): boolean {
        return this.featureDependency !== undefined;
    }

    featureDependencySatisfied(): boolean {
        if (this.featureDependency) {
            return this.featureDependency();
        }

        return false;
    }
}
