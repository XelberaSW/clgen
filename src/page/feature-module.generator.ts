import path from 'path';

import fs from 'fs/promises';

import { getStateProviderFileName } from '../state/utils';
import { kebabToPascal, run } from '../utils';
import { getModuleRelativePath, writeModule } from './module.generator';
import { PartialContextEx } from './utils';

export async function initializeFeatureModule(directory: string, ctx: PartialContextEx) {
    const type = 'feature';
    const src = path.join(directory, 'src');
    const lib = path.join(src, 'lib');

    const { standalone, camel, ns, kebab, name, providers, featureModuleClassName, uiModuleClassName, dataModuleClassName } = ctx;

    const pageNameKebab = `${kebab}-page`;
    const pageNamePascal = kebabToPascal(pageNameKebab);

    let command = `npx nx g @nrwl/angular:component components/${pageNameKebab} --project ${kebab}-${type}  --changeDetection=OnPush --skipSelector --style=none --inlineTemplate`;
    if (standalone) {
        command += ` --standalone`;
    }
    else {
        command += ` --module ${kebab}-${type}.module`;
    }
    await run(command);

    const moduleFile = path.join(lib, `${kebab}-${path.basename(directory)}.module.ts`);
    await fs.rm(moduleFile, { force: true });

    const routesName = `${camel}Routes`;

    const moduleRelativePath = getModuleRelativePath(directory, type).replace(/\.ts$/, '');
    const componentClassName = `${pageNamePascal}Component`;
    let moduleContents = '';

    if (standalone) {
        moduleContents += "import type { Routes } from '@angular/router';";
    }
    else {
        moduleContents += `import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';`;
    }

    moduleContents += `

import { ${componentClassName} } from './components/${pageNameKebab}/${pageNameKebab}.component';
`;
    if (standalone) {
        moduleContents += `import { ${providers} } from '${ns}/${kebab}/data';
`;
    }
    else {
        moduleContents += `import { ${dataModuleClassName} } from '${ns}/${kebab}/data';
import { ${uiModuleClassName} } from '${ns}/${kebab}/ui';

`;
    }
    moduleContents += `

`;
    if (standalone) {
        moduleContents += 'export ';
    }

    moduleContents += `const ${routesName}: Routes = [{
    path: '',`;

    if (standalone) {
        moduleContents += `
    providers: [
        ${providers}
    ],`;
    }

    moduleContents += `
    component: ${componentClassName},
    title: '${name}'
}];
`;

    if (!standalone) {
        moduleContents += `
@NgModule({
    imports: [RouterModule.forChild(${routesName})],
    exports: [RouterModule]
})
export class RoutingModule { }

@NgModule({
    imports: [
        CommonModule,
        RoutingModule,

        ${uiModuleClassName},
        ${dataModuleClassName}
    ],
    providers: []
})
export class ${featureModuleClassName} { }
`;
    }

    await writeModule(directory, type, moduleContents);


    await fs.writeFile(path.join(src, 'index.ts'), `export { ${standalone ? routesName : featureModuleClassName} } from './${moduleRelativePath}';
`, 'utf-8');
}
