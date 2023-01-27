import path from 'path';

import { loadNearest, run } from '../utils';

export async function generateLibraries(name: string) {
    const nxJson = await loadNearest('nx.json');
    let root = nxJson?.workspaceLayout?.libsDir;

    if (!root) {
        const angularJson = await loadNearest('angular.json');
        root = angularJson?.newProjectRoot;
    }

    if (!root) {
        console.warn('Root directory for new libraries could not be found');
        return null;
    }

    root = path.resolve(root);

    await run(`npx nx g @nrwl/angular:library ui --directory ${name}`);
    await run(`npx nx g @nrwl/angular:library model --directory ${name}`);
    await run(`npx nx g @nrwl/angular:library data --directory ${name}`);
    await run(`npx nx g @nrwl/angular:library feature --directory ${name}`);

    return {
        ui: path.join(root, name, 'ui'),
        model: path.join(root, name, 'model'),
        data: path.join(root, name, 'data'),
        feature: path.join(root, name, 'feature')
    };
}