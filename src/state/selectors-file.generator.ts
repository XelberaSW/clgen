import path from 'path';

import fs from 'fs/promises';

import { Context } from './context';

export async function generateSelectorsFile(ctx: Context) {
    const { directory, kebab, selectors, name, feature, state } = ctx;
    const filePath = path.join(directory, `${kebab}.selectors.ts`);
    await fs.writeFile(filePath, `import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ${feature}, ${state} } from './${kebab}.state';

const feature = createFeatureSelector<${state}>(${feature});

const foo = createSelector(feature, state => state.foo);

/**
 * Selectors for ${name}
 * */
export const ${selectors} = {
    foo
};
`, 'utf-8');

    console.info('..', filePath);
}