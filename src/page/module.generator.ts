import path from 'path';

import fs from 'fs/promises';

export function getModuleRelativePath(directory: string, moduleName: 'ui' | 'data' | 'models' | 'feature') {
    const dirname = path.basename(path.resolve(directory, '..'));
    const libPath = path.join('lib', `${dirname}-${moduleName}.module.ts`);
    return libPath;
}

export function getModulePath(directory: string, moduleName: 'ui' | 'data' | 'models' | 'feature') {
    const libPath = path.join(directory, 'src', getModuleRelativePath(directory, moduleName));
    return libPath;
}

export async function writeModule(directory: string, moduleName: 'ui' | 'data' | 'models' | 'feature', content: string) {
    const libPath = getModulePath(directory, moduleName);
    await fs.writeFile(libPath, content, 'utf-8');
}