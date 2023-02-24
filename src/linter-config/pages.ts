import { Command, Option } from 'commander';

import { proceedDepConstraints } from './utils';

const add = new Command('add')
    .description("Add new page rules to linter config")
    .argument('<name>', 'page to add')
    .option('--public', 'This page is public, so could be accessed by anyone')
    .action(async (pageName: string, options: { public: boolean }) => {
        await addPage(pageName, options.public);
    });
const remove = new Command('remove')
    .description("Add new page rules to linter config")
    .argument('<name>', 'page to add')
    .action(async (pageName: string) => {
        const tagName = 'page:' + pageName;

        await proceedDepConstraints((items) => {
            let hasChanges = false;
            for (const item of [...items]) {
                if (item.sourceTag === tagName) {
                    const idx = items.indexOf(item);
                    if (idx !== -1) {
                        items.splice(idx, 1);
                        hasChanges = true;
                    }
                }
                else if (item.onlyDependOnLibsWithTags.includes(tagName)) {
                    hasChanges = true;
                    item.onlyDependOnLibsWithTags = item.onlyDependOnLibsWithTags.filter(x => x !== tagName);
                }
            }

            return hasChanges;
        });
    });



export default new Command("page")
    .description("Page specific commands")
    .addCommand(add)
    .addCommand(remove);

export async function addPage(pageName: string, publicAccess: boolean) {
    const tagName = 'page:' + pageName;

    return await proceedDepConstraints(async items => {
        if (items.find(x => x.sourceTag === tagName)) {
            console.warn('Page ' + pageName + ' was registered already');
            return false;
        }

        items.push({
            sourceTag: tagName,
            onlyDependOnLibsWithTags: [
                publicAccess ? '*' : tagName
            ]
        });

        return true;
    });
}

