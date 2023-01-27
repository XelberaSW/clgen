import path from 'path';

import fs from 'fs/promises';

import { Context } from './context';

export async function generateActionsFile(ctx: Context) {
    const { directory, kebab, name, actions, feature } = ctx;
    const filePath = path.join(directory, `${kebab}.actions.ts`);
    await fs.writeFile(filePath, `import { createAction, props } from '@ngrx/store';

import { ${feature} } from './${kebab}.state';

const foo = createAction(\`[$\{${feature}}] Foo action\`, props<{ bar: string }>());

/**
 * Actions for ${name}
 * */
export const ${actions} = {
    foo
};

// FIXME Uncomment if you are using this in library, or delete if you do not need this at all
// export const Public${actions} = {
//     foo
// };
`, 'utf-8');

    console.info('..', filePath);
}