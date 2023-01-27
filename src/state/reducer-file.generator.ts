import path from 'path';

import fs from 'fs/promises';

import { Context } from './context';

export async function generateReducerFile(ctx: Context) {
    const { directory, kebab, state, reducer, actions } = ctx;

    const defaultStateGetter = `getDefault${state}`;
    const filePath = path.join(directory, `${kebab}.reducer.ts`);
    await fs.writeFile(filePath, `import { createReducer, on } from '@ngrx/store';

import { ${state}, ${defaultStateGetter} } from './${kebab}.state';
import { ${actions} } from './${kebab}.actions';

export const ${reducer} = createReducer<${state}>(${defaultStateGetter}(), 
    on(${actions}.foo, (state, { bar }) => ({
        ...state,
        foo: bar
    }))
);

`, 'utf-8');

    console.info('..', filePath);
}