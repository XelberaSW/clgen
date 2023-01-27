import { Command } from 'commander';
import path from 'path';

import { readFile, writeFile } from 'fs/promises';

import { getPartialContextByName } from '../state/utils';
import { camelToKebab, getNearestPath, loadJson } from '../utils';
import { initializeDataModule } from './data-module.generator';
import { initializeFeatureModule } from './feature-module.generator';
import { generateLibraries } from './libraries.generator';
import { initializeModelsModule } from './models-module.generator';
import { initializeUiModule } from './ui-module.generator';
import { PartialContextEx } from './utils';

export default new Command('page')
    .argument('<name>', 'Name of page to be added')
    .option('-r|--route <url>', 'Route where page will be awailable at')
    .action(async (pageName: string, options: { route: string }) => {
        pageName = camelToKebab(pageName);
        const routeToBeUsed = options.route ? camelToKebab(options.route) : null;

        const pathes = await generateLibraries(pageName);
        if (!pathes) {
            return;
        }

        const packageJsonPath = await getNearestPath('package.json');
        if (!packageJsonPath) {
            return;
        }
        const packageJson = await loadJson(packageJsonPath);
        const ns = packageJson.name;

        const ctx: PartialContextEx = getPartialContextByName(pageName) as any;

        ctx.ns = ns;

        await Promise.all([
            initializeDataModule(pathes.data, ctx, routeToBeUsed),
            initializeFeatureModule(pathes.feature, ctx),
            initializeUiModule(pathes.ui, ctx),
            initializeModelsModule(pathes.model, ctx)
        ]);

        const root = path.dirname(packageJsonPath);
        const data = await readFile(path.join(root, 'tsconfig.json'), 'utf-8');
        const newData = data.replace(`"${ctx.kebab}/ui"`, `"${ns}/${ctx.kebab}/ui"`)
            .replace(`"${ctx.kebab}/data"`, `"${ns}/${ctx.kebab}/data"`)
            .replace(`"${ctx.kebab}/feature"`, `"${ns}/${ctx.kebab}/feature"`)
            .replace(`"${ctx.kebab}/model"`, `"${ns}/${ctx.kebab}/model"`);
        await writeFile(path.join(root, 'tsconfig.json'), newData, 'utf-8');
    });