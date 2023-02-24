import path from 'path';

import fs from 'fs/promises';

import { createStateAsync } from '../state';
import { getStateProviderFileName } from '../state/utils';
import { kebabToPascal } from '../utils';
import { getModulePath, getModuleRelativePath, writeModule } from './module.generator';
import { PartialContextEx } from './utils';

export async function initializeDataModule(directory: string, ctx: PartialContextEx, skipState: boolean, routeToBeUsed: string | null) {
    const type = 'data';
    const indexPath = path.join(directory, 'src', 'index.ts');
    let indexContents = '';

    const { actions, kebab, providers, name, standalone, selectors, dataModuleClassName } = ctx;

    if (ctx.standalone) {
        const modulePath = getModulePath(directory, type);
        await fs.rm(modulePath);

        indexContents += `export { ${providers} } from './lib/state/${getStateProviderFileName(kebab)}';
`;
    }
    else {
        let moduleContents = `import { NgModule } from '@angular/core';

`;
        if (!skipState) {
            moduleContents += `import { ${providers} } from './state/${getStateProviderFileName(kebab)}';
            
`;
        }

        moduleContents += `@NgModule({
`;
        if (!skipState) {
            moduleContents += `    imports: [
        ${providers}
    ],`;
        }

        moduleContents += `
    providers: []
})
export class ${dataModuleClassName} { }        
`;
        await writeModule(directory, type, moduleContents);

        const modulePath = getModuleRelativePath(directory, type);
        indexContents += `export { ${dataModuleClassName} } from './${modulePath.replace(/\.ts/, '')}';
`;
    }

    if (!skipState) {
        await createStateAsync(name, { directory: path.join(directory, 'src', 'lib'), skipEffects: false, sameDirectory: false, standalone: standalone });

        indexContents += `
export { Public${actions} as ${actions} } from './lib/state/${kebab}.actions';
export { ${selectors} } from './lib/state/${kebab}.selectors';
`;
    }

    await fs.writeFile(indexPath, indexContents, 'utf-8');


    console.log({ routeToBeUsed });
}