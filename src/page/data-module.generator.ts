import path from 'path';

import { createStateAsync } from '../state';
import { getStateProviderFileName } from '../state/utils';
import { writeModule } from './module.generator';
import { PartialContextEx } from './utils';

export async function initializeDataModule(directory: string, ctx: PartialContextEx, routeToBeUsed: string | null) {
    await createStateAsync(ctx.name, { directory: path.join(directory, 'src', 'lib'), skipEffects: false, sameDirectory: false });

    console.log({ routeToBeUsed });

    await writeModule(directory, 'data', `import { Routes } from '@angular/router';

import { ${ctx.pascal}Component } from '${ctx.ns}/${ctx.kebab}/feature';
import { ${ctx.providers} } from './state/${getStateProviderFileName(ctx.kebab)}';

export const routes: Routes = [{
    path: '',
    providers: [
        ${ctx.providers}
    ],
    component: ${ctx.pascal}Component,
    title: '${ctx.name}'
}];
`);
}