import { Command } from 'commander';

import init from './init';
import pages from './pages';

export default new Command('rules')
    .description('Setup dependency restriction linter rules')
    .addCommand(init)
    .addCommand(pages);

