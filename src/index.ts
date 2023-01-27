#!/usr/bin/env node 

import { program } from 'commander';

import page from './page';
import state from './state';

program
    .addCommand(page)
    .addCommand(state)
    .helpOption()
    .parse(process.argv);











