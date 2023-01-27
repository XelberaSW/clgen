import path from 'path';

import fs from 'fs/promises';

import { PartialContextEx } from './utils';

export async function initializeUiModule(directory: string, ctx: PartialContextEx) {
    const src = path.join(directory, 'src');
    const lib = path.join(src, 'lib');

    const moduleFile = path.join(lib, `${ctx.kebab}-${path.basename(directory)}.module.ts`);

    await fs.rm(moduleFile, { recursive: true });

    await fs.writeFile(path.join(src, 'index.ts'), `// FIXME export UI components here 
`, 'utf-8');
}