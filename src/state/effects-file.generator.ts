
import path from 'path';

import fs from 'fs/promises';

import { Context } from './context';

export async function generateEffectsFile(ctx: Context) {
    const { directory, kebab, effects, name, feature, actions } = ctx;

    const filePath = path.join(directory, `${kebab}.effects.ts`);
    await fs.writeFile(filePath, `import { Injectable } from '@angular/core';

import { Actions, OnInitEffects, createEffect, ofType } from '@ngrx/effects';
import { Action, createAction } from '@ngrx/store';
import { switchMap } from 'rxjs';

import { ${feature} } from './${kebab}.state';
import { ${actions} } from './${kebab}.actions';

const initAction = createAction(\`[$\{${feature}}] Initialize ${name}\`);

@Injectable()
export class ${effects} implements OnInitEffects {
    constructor(
        private readonly actions$: Actions
    ) {}

    readonly onInitAction$ = createEffect(() => this.actions$.pipe(
        ofType(initAction),
        switchMap(() => [${actions}.foo({ bar: '${name}' })])
    ));

    ngrxOnInitEffects(): Action {
        return initAction();
    }    
}
`, 'utf-8');

    console.info('..', filePath);
}