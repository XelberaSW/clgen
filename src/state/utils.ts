import { camelToKebab, kebabToPascal } from '../utils';
import { Context } from './context';

export type PartialContext = Omit<Context, 'directory' | 'hasEffects' | 'standalone'>;

export function getPartialContextByName(name: string): PartialContext {
    const fixedName = name.replace(/\s+/g, '-').replace(/^-+/, '');
    const pascal = kebabToPascal(fixedName);
    const camel = pascal[0].toLowerCase() + pascal.substring(1);
    const kebab = camelToKebab(fixedName);
    const upper = kebab.toUpperCase().replace('-', '_');

    const reducer = camel + 'Reducer';
    const effects = pascal + 'Effects';
    const actions = pascal + 'Actions';
    const selectors = pascal + 'Selectors';
    const state = pascal + 'State';
    const feature = `${upper}_FEATURE`;
    const providers = `${pascal}Providers`;

    const dataModuleClassName = `${pascal}DataModule`;
    const featureModuleClassName = `${pascal}FeatureModule`;
    const uiModuleClassName = `${pascal}UiModule`;


    const ctx: PartialContext = {
        name,
        fixedName,
        pascal,
        camel,
        kebab,
        upper,
        reducer,
        effects,
        actions,
        selectors,
        state,
        feature,
        providers,

        dataModuleClassName,
        featureModuleClassName,
        uiModuleClassName
    };

    return ctx;
}

export function getStateProviderFileName(kebab: string): string {
    return `${kebab}-state.providers`;
}