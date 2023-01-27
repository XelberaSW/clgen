
import path from 'path';

import fs from 'fs/promises';

import { Context } from './context';

export async function generateStateFile(ctx: Context) {
    const { directory, kebab, feature, upper, state, name } = ctx;

    const filePath = path.join(directory, `${kebab}.state.ts`);
    await fs.writeFile(filePath, `export const ${feature} = '${upper}';

/**
 * State for ${name}
 * */
export interface ${state} {
    foo: string;
}

export function getDefault${state}(): ${state} {
    return {
        foo: 'bar'
    };
}            
`, 'utf-8');

    console.info('..', filePath);
}