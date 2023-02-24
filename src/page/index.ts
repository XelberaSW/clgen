import { Command } from 'commander';
import path from 'path';

import fs, { writeFile } from 'fs/promises';

import { getPartialContextByName } from '../state/utils';
import { camelToKebab, fileExistsSafe, getNearestPath, loadJson, loadNearest } from '../utils';
import { initializeDataModule } from './data-module.generator';
import { initializeFeatureModule } from './feature-module.generator';
import { generateLibraries } from './libraries.generator';
import { initializeModelsModule } from './models-module.generator';
import { initializeUiModule } from './ui-module.generator';
import { PartialContextEx } from './utils';

export default new Command('page')
    .description('Create set of libraries to be used as a single page')
    .argument('<name>', 'Name of page to be added')
    .option('--standalone', 'Use Angular Standalone API')
    .option('--skip-state', 'Do not generate state')
    .option('--verbose', 'Show verbose output')
    .option('-r|--route <url>', 'Route where page will be awailable at')
    .action(async (pageName: string, options: { route: string, skipState: boolean, standalone: boolean, verbose: boolean }) => {
        pageName = camelToKebab(pageName);
        const routeToBeUsed = options?.route ? camelToKebab(options.route) : null;
        const skipState = options?.skipState ?? false;
        const standalone = options?.standalone ?? false;
        const verbose = options?.verbose ?? false;

        const packageJsonPath = await getNearestPath('package.json');
        if (!packageJsonPath) {
            return;
        }

        const root = path.dirname(packageJsonPath);
        await patchNxIfNeeded(path.join(root, 'node_modules/@nrwl/devkit/src/tasks/install-packages-task.js'));

        const pathes = await generateLibraries(pageName, verbose);
        if (!pathes) {
            return;
        }

        const packageJson = await loadJson(packageJsonPath);

        const ns = packageJson.name;

        const ctx: PartialContextEx = getPartialContextByName(pageName) as any;

        ctx.ns = ns;
        ctx.standalone = standalone;


        await Promise.all([
            initializeDataModule(pathes.data, ctx, skipState, routeToBeUsed),
            initializeFeatureModule(pathes.feature, ctx),
            initializeUiModule(pathes.ui, ctx),
            initializeModelsModule(pathes.model, ctx)
        ]);

        await patchTsConfig(root, ctx);

    });

async function patchNxIfNeeded(filePath: string) {
    if (!await fileExistsSafe(filePath)) {
        // nothing to patch
        return false;
    }

    const content = await fs.readFile(filePath, 'utf-8');

    const header = '/* patched by clgen */';
    if (content.startsWith(header)) {
        // already patched
        return false;
    }

    const codeToPatch = 'const { detectPackageManager, getPackageManagerCommand, joinPathFragments } = (0, nx_1.requireNx)();';
    const patchedCode = `const nx_1_import = (0, nx_1.requireNx)();
const { detectPackageManager, getPackageManagerCommand} = nx_1_import;

let { joinPathFragments } = nx_1_import;

if (!joinPathFragments) {
    joinPathFragments = path_1.join;
}
`;

    const patchedContent = `${header}
    
${content.replace(codeToPatch, patchedCode)}`;

    await fs.writeFile(filePath, patchedContent, 'utf-8');

    return true
}

async function patchTsConfig(root: string, ctx: PartialContextEx) {
    const nxJson = await loadNearest('nx.json');
    let npmScope = nxJson?.npmScope;
    let suffix = ctx.kebab;
    if (npmScope) {
        suffix = `@${npmScope}/${suffix}`;
    }
    const fixPathMappings = (obj: any) => {
        let changed = false;
        for (const module of ['ui', 'data', 'feature', 'model']) {
            const key = `${suffix}/${module}`;
            if (key in obj) {
                obj[`${ns}/${ctx.kebab}/${module}`] = obj[key];
                delete obj[key];
                changed = true;
            }
        }

        return changed;
    };

    const ns = ctx.ns;

    const filesToCheck = [
        path.join(root, 'tsconfig.json'),
        path.join(root, 'tsconfig.base.json')
    ];
    const filesChecked: string[] = [];
    while (filesToCheck.length) {
        const tsconfigFilePath = filesToCheck.shift();
        if (!tsconfigFilePath) {
            // no file for some reason
            continue;
        }
        filesChecked.push(tsconfigFilePath);

        if (!await fileExistsSafe(tsconfigFilePath)) {
            // file does not exist
            continue;
        }

        const tsConfig = await loadJson(tsconfigFilePath);
        if (!tsConfig) {
            // file could not be read
            continue;
        }

        const paths = tsConfig.compilerOptions?.paths;
        let hasChanges = false;
        if (paths && paths instanceof Object && !Array.isArray(paths)) {
            hasChanges = fixPathMappings(paths);
        }

        if (hasChanges) {
            const dataToWrite = JSON.stringify(tsConfig, null, 4);
            await writeFile(tsconfigFilePath, dataToWrite, 'utf-8');
            return;
        }

        let fileToCheckNext = tsConfig.extends;
        if (!path.isAbsolute(fileToCheckNext)) {
            const myRoot = path.dirname(tsconfigFilePath);
            fileToCheckNext = path.join(myRoot, fileToCheckNext);
        }

        if (!filesChecked.includes(fileToCheckNext) &&
            !filesToCheck.includes(fileToCheckNext)) {
            filesToCheck.push(fileToCheckNext);
        }
    }

    console.warn('TsConfig was not patched for some reason. Please check generated modules, there could be some issues with namespaces');
}

