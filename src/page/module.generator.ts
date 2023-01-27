import path from 'path';

import fs from 'fs/promises';

export async function writeModule(directory: string, moduleName: 'ui' | 'data' | 'models' | 'feature', content: string) {
    const dirname = path.basename(path.resolve(directory, '..'));
    const libPath = path.join(directory, 'src', 'lib', `${dirname}-${moduleName}.module.ts`);
    await fs.writeFile(libPath, content, 'utf-8');
}