import path from 'path';

import fs from 'fs/promises';

import { Context } from './context';
import { getStateProviderFileName } from './utils';

export async function generateProvidersFile(ctx: Context) {
    const { directory, feature, reducer, effects, kebab, providers, hasEffects } = ctx;
    const ngrxEffectsImport = hasEffects ? `import { EffectsModule } from '@ngrx/effects';
` : '';
    const effectsImport = hasEffects ? `import { ${effects} } from './${kebab}.effects';
` : '';
    const effectsModule = hasEffects ? `EffectsModule.forFeature([${effects}]),
    `: '';

    const filePath = path.join(directory, getStateProviderFileName(kebab)+'.ts');
    await fs.writeFile(filePath, `import { importProvidersFrom } from '@angular/core';

${ngrxEffectsImport}import { StoreModule } from '@ngrx/store';

${effectsImport}import { ${reducer} } from './${kebab}.reducer';
import { ${feature} } from './${kebab}.state';

export const ${providers} = importProvidersFrom(
    ${effectsModule}StoreModule.forFeature(${feature}, ${reducer})
);
`, 'utf-8');

    console.info('..', filePath);
}