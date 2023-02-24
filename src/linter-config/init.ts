import { Command } from 'commander';
import { isEqual } from 'lodash';

import { DepConstraint, proceedDepConstraints } from './utils';

export default new Command('init')
    .description("(Re)initialize 'type:*' tags restrictions for linter")
    .action(async () => {
        await proceedDepConstraints(deps => {
            let hasChanges = false;
            hasChanges ||= tryAdd(deps, "app", "type:feature");
            hasChanges ||= tryAdd(deps, "type:feature", "type:data", "type:ui", "type:models");
            hasChanges ||= tryAdd(deps, "type:data", "type:models");
            hasChanges ||= tryAdd(deps, "type:ui", "type:models");
            hasChanges ||= tryAdd(deps, "type:models", "type:models");

          
            return hasChanges;
        });
    });

function tryAdd(entries: DepConstraint[], tag: string, ...deps: string[]) {
    const existing = entries.find(e => e.sourceTag === tag);
    if (existing) {
        existing.onlyDependOnLibsWithTags = existing.onlyDependOnLibsWithTags.sort();
        deps = deps.sort();

        if (!isEqual(existing.onlyDependOnLibsWithTags, deps)) {
            existing.onlyDependOnLibsWithTags = deps;
            return true;
        }
        return false;
    }

    entries.push({
        sourceTag: tag,
        onlyDependOnLibsWithTags: deps
    });
    return true;
}