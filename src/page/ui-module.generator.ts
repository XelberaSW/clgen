import path from 'path';

import fs from 'fs/promises';

import { run } from '../utils';
import { writeModule } from './module.generator';
import { PartialContextEx } from './utils';

export async function initializeUiModule(directory: string, ctx: PartialContextEx) {
    const type = 'ui';
    const src = path.join(directory, 'src');
    const lib = path.join(src, 'lib');

    let command = `npx nx g @nrwl/angular:component ${ctx.kebab} --project ${ctx.kebab}-${type}  --changeDetection="OnPush"`;
    if (ctx.standalone) {
        command += ` --standalone`;
    }
    else {
        command += ` --module ${ctx.kebab}-${type}.module`;
    }
    await run(command);

    const moduleFile = path.join(lib, `${ctx.kebab}-${path.basename(directory)}.module.ts`);

    await fs.rm(moduleFile, { recursive: true });

    if (!ctx.standalone) {
        await writeModule(directory, type, `import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ${ctx.pascal}Component } from './${ctx.kebab}/${ctx.kebab}.component';

@NgModule({
    declarations: [
        ${ctx.pascal}Component
    ],
    imports: [
        CommonModule
    ],
    exports: [
        ${ctx.pascal}Component
    ],
    providers: []
})
export class ${ctx.uiModuleClassName} { }
`);

        await fs.writeFile(path.join(src, 'index.ts'), `export { ${ctx.uiModuleClassName} } from './lib/${ctx.kebab}-ui.module';
`, 'utf-8');
    }
    else {
        await fs.writeFile(path.join(src, 'index.ts'), `export { ${ctx.pascal}Component } from './lib/${ctx.kebab}/${ctx.kebab}.component';
`, 'utf-8');
    }
}