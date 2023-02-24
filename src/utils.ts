import { exec } from 'child_process';
import path from 'path';

import fs from 'fs/promises';

export async function run(commandToRun: string, verbose?: boolean) {
    return new Promise<void>((resolve, reject) => {
        if (verbose) {
            console.info('[EXEC] ', commandToRun);
        }
        exec(commandToRun, (error, stdout, stderr) => {
            if (verbose) {
                console.log(stdout);
            }
            if (stderr) {
                console.warn(`${stderr}`);
            }
            if (error) {
                reject(error);
                return;
            }
            //console.log(`stdout: ${stdout}`);
            resolve();
        });
    });
}

export async function getNearestPath(fileName: string) {
    let root = path.resolve('.');

    // eslint-disable-next-line no-constant-condition
    while (true) {
        const nxJsonFilePath = path.join(root, fileName);

        try {
            if ((await fs.stat(nxJsonFilePath)).isFile()) {
                return nxJsonFilePath;
            }
        }
        catch {
            // do nothing
        }

        const newRoot = path.resolve(root, '..');
        if (newRoot === root) {
            return null;
        }

        root = newRoot;
    }
}

export async function loadNearest(fileName: string) {
    const filePath = await getNearestPath(fileName);
    if (!filePath) {
        return null;
    }

    return loadJson(filePath);
}

export async function loadJson(filePath: string) {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
}


export function camelToKebab(str: string) {
    str = str.replace(/\s+/g, '-').replace(/^[A-Z]/, (match) => match.toLowerCase());
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

export function kebabToPascal(str: string) {
    str = str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    return str[0].toUpperCase() + str.substring(1);
}

export async function fileExistsSafe(filePath: string): Promise<boolean> {
    try {
        return (await fs.stat(filePath)).isFile();
    }
    catch {
        return false;
    }
}