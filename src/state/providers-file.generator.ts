import path from 'path';

import fs from 'fs/promises';

import { Context } from './context';
import { getStateProviderFileName } from './utils';

export async function generateProvidersFile(ctx: Context) {
    const standalone = ctx.standalone;

    const { directory, kebab } = ctx;

    const contents = standalone ? getStandaloneContent(ctx) : getLegacyContent(ctx);

    const filePath = path.join(directory, getStateProviderFileName(kebab) + '.ts');
    await fs.writeFile(filePath, contents, 'utf-8');

    console.info('..', filePath);
}

function getStandaloneContent(ctx: Context) {
    const { feature, reducer, effects, hasEffects } = ctx;

    return getContents(ctx, () => {
        let result = '';

        if (hasEffects) {
            result += `import { provideEffects } from '@ngrx/effects';
`;
        }

        result += "import { provideState } from '@ngrx/store';";

        return result;
    }, () => {
        let result = `[
    `;
        if (hasEffects) {
            result += `provideEffects([${effects}]),
    `;
        }

        result += `provideState(${feature}, ${reducer})
]`;

        return result;
    });
}

function getLegacyContent(ctx: Context) {
    const { feature, reducer, effects, hasEffects } = ctx;
    return getContents(ctx, () => {
        let result = '';
        if (hasEffects) {
            result += `import { EffectsModule } from '@ngrx/effects';
`;
        }

        result += "import { StoreModule } from '@ngrx/store';";

        return result;
    }, () => {
        let result = `[
    `;
        if (hasEffects) {
            result += `EffectsModule.forFeature([${effects}]),
    `;
        }

        result += `StoreModule.forFeature(${feature}, ${reducer})
]`;

        return result;
    });
}

function getContents(ctx: Context, getVendorImports: () => string, getValue: () => string) {
    const { feature, reducer, effects, kebab, providers, hasEffects } = ctx;

    const effectsImport = hasEffects ? `import { ${effects} } from './${kebab}.effects';
` : '';

    return `${getVendorImports()}
    
${effectsImport}import { ${reducer} } from './${kebab}.reducer';
import { ${feature} } from './${kebab}.state';

export const ${providers} = ${getValue()};`
}
