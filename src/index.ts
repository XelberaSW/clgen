#!/usr/bin/env node 

import { program } from 'commander';

import linterConfig from './linter-config';
import page from './page';
import state from './state';

program
    .addCommand(page)
    .addCommand(state)
    .addCommand(linterConfig)
    .helpOption()
    .parse(process.argv);











