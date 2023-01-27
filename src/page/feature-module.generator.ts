import { run } from '../utils';
import { writeModule } from './module.generator';
import { PartialContextEx } from './utils';

export async function initializeFeatureModule(directory: string, ctx: PartialContextEx) {
    const type = 'feature';
    
    const command = `npx nx g @nrwl/angular:component components/${ctx.kebab} --module ${ctx.kebab}-${type}.module --project ${ctx.kebab}-${type} --standalone`;
    await run(command);

    await writeModule(directory, 'feature', `export { ${ctx.pascal}Component } from './components/${ctx.kebab}/${ctx.kebab}.component';
`);
}