import path from 'path';

import fs from 'fs/promises';

import { run } from '../utils';
import { writeModule } from './module.generator';
import { PartialContextEx } from './utils';

export async function initializeFeatureModule(directory: string, ctx: PartialContextEx) {
    const type = 'feature';
    const src = path.join(directory, 'src');
    const lib = path.join(src, 'lib');

    const command = `npx nx g @nrwl/angular:component components/${ctx.kebab} --module ${ctx.kebab}-${type}.module --project ${ctx.kebab}-${type} --standalone`;
    await run(command);

    const moduleFile = path.join(lib, `${ctx.kebab}-${path.basename(directory)}.module.ts`);
    await fs.rm(moduleFile, { force: true });

    await fs.writeFile(path.join(src, 'index.ts'), `export { ${ctx.pascal}Component } from './lib/components/${ctx.kebab}/${ctx.kebab}.component';
`, 'utf-8');
}