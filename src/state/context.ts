export interface Context {
    directory: string,

    name: string,
    fixedName: string,

    pascal: string,
    camel: string,
    kebab: string,
    upper: string,
    reducer: string,
    effects: string,
    actions: string,
    selectors: string,
    state: string,
    feature: string,
    providers: string,

    dataModuleClassName: string;
    featureModuleClassName: string;
    uiModuleClassName: string;

    hasEffects: boolean;

    standalone: boolean;
}