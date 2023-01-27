import path from 'path';

import fs, { writeFile } from 'fs/promises';

import { camelToKebab } from '../utils';
import { PartialContextEx } from './utils';

export async function initializeModelsModule(directory: string, ctx: PartialContextEx) {
    const src = path.join(directory, 'src');
    const lib = path.join(src, 'lib');

    const moduleFile = path.join(lib, `${ctx.kebab}-${path.basename(directory)}.module.ts`);
    await fs.rm(moduleFile, { force: true });

    const modelName = 'Foo';
    const sampleModelFile = `${camelToKebab(modelName)}.model`;
    await writeFile(path.join(lib, sampleModelFile + '.ts'), `export type ${modelName} = {
    bar: string;
}`, 'utf-8');

    await writeFile(path.join(src, 'index.ts'), `export { ${modelName} } from './lib/${sampleModelFile}';
`, 'utf-8');
}