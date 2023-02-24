import fs from 'fs/promises';

import { getNearestPath, loadNearest } from '../utils';

export type DepConstraint = {
    sourceTag: string,
    onlyDependOnLibsWithTags: string[]
}

type Override = {
    files: string[];
    env?: Record<string, string>;
    rules: Record<string, ['error' | 'warn', any]>;
}

export async function proceedDepConstraints(handler: (constraints: DepConstraint[]) => Promise<boolean> | boolean) {
    const configFileName = '.eslintrc.json';
    const linterConfig = await loadNearest(configFileName);

    const id = '@nrwl/nx/enforce-module-boundaries';
    const overrides: Override[] = linterConfig?.overrides;
    const boundaries: DepConstraint[] = overrides?.find(i => Boolean(i.rules?.[id]))?.rules?.[id]?.[1]?.depConstraints;
    if (!Array.isArray(boundaries)) {
        console.warn('Could not load boundary rules to patch');
        return false;
    }

    if (await handler(boundaries)) {
        const fullPath = await getNearestPath(configFileName);

        boundaries.sort((a, b) => a.sourceTag.localeCompare(b.sourceTag));

        const dataToSave = JSON.stringify(linterConfig, null, 4);

        await fs.writeFile(fullPath!, dataToSave, 'utf-8');

        console.log('@nrwl/nx/enforce-module-boundaries settings updated!');

        return true;
    }

    console.log('Nothing to be done! @nrwl/nx/enforce-module-boundaries settings up to date!');

    return false;
}