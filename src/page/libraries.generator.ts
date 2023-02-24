import path from 'path';

import { addPage } from '../linter-config/pages';
import { loadNearest, run } from '../utils';

export async function generateLibraries(name: string, verbose: boolean) {
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

    const verbosity = verbose ? '--verbose' : '';

    const getCommandLline = (type: 'ui' | 'model' | 'data' | 'feature') => {
        return `npx nx g @nrwl/angular:library ${type} --directory ${name} --tags="page:${name}","type:${type}" ${verbosity}`;
    }

    await run(getCommandLline('ui'), verbose);
    await run(getCommandLline('data'), verbose);
    await run(getCommandLline('feature'), verbose);
    await run(getCommandLline('model'), verbose);

    await addPage(name, false);

    return {
        ui: path.join(root, name, 'ui'),
        model: path.join(root, name, 'model'),
        data: path.join(root, name, 'data'),
        feature: path.join(root, name, 'feature')
    };
}