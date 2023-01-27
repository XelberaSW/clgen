import { Command } from 'commander';
import path from 'path';

import fs from 'fs/promises';

import { generateActionsFile } from './action-file.generator';
import { Context } from './context';
import { generateEffectsFile } from './effects-file.generator';
import { generateProvidersFile } from './providers-file.generator';
import { generateReducerFile } from './reducer-file.generator';
import { generateSelectorsFile } from './selectors-file.generator';
import { generateStateFile } from './state-file.generator';
import { getPartialContextByName } from './utils';

export default new Command('state')
    .argument('<name>', 'Name of state to be added. This will be the feature name as well')
    .option('-d|--directory <path>', 'Directory to generate state in', '.')
    .option('--skip-effects', 'Do not generate effects', false)
    .option('-s|--same-directory', 'Do not generate state directory. Put all state items in directory providerd byt -d option', false)
    .action(createStateAsync);

export async function createStateAsync(name: string, options: { directory: string, skipEffects: boolean, sameDirectory: boolean }) {
    const { skipEffects, sameDirectory } = options;
    let directory = path.resolve(options.directory);

    if (!sameDirectory) {
        directory = path.join(directory, 'state');
    }

    await fs.mkdir(directory, { recursive: true });

    console.info('Writing state to ', directory);

    const ctx: Context = {
        ...getPartialContextByName(name),
        directory,
        hasEffects: !skipEffects
    };

    await Promise.all([
        generateActionsFile(ctx),
        generateStateFile(ctx),
        generateSelectorsFile(ctx),
        generateReducerFile(ctx),
        generateProvidersFile(ctx),
        skipEffects ? Promise.resolve() : generateEffectsFile(ctx)
    ]);

    console.info('Done');
}