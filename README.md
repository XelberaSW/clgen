
# ClGen by XelberaSW

  

This tool was created to simplify some kind of everyday operation like:

- creating UI modules in a separate library for Angular 14+ using [Nx](https://nx.dev/).

- creating feature states using [NgRx](https://ngrx.io/) as state manager

  

# Installation

## Prerequisite

You need [Nx](https://nx.dev/) installed and set up before using this tool.

Via NPM:

     npm i nx -D

  
Via Yarn:

    yarn add nx -D

Then you need to initialise Nx workspace by running following command:

    npx nx init

If you have Nx installed globally, please run nx command without npx prefix.

## Tool installation
### Via npm

    npm i @xelberasw/clgen -D

If you want this tool to be installed globally, append -g  key to command

### Via yarn

    yarn add @xelberasw/clgen -D

If you want this tool to be installed globally, append -g  key to command

## Usage

This tool is installed as binary. You could use `npx clgen` command on projects root for generating stuff.

Use following command to get usage help information:

    npx clgen help

### Commands available:

#### state
This command generates set of state-related files. State manager is  [NgRx](https://ngrx.io/).
Set of files created at directory specified by `--directory`:
- &lt;name&gt;.actions.ts
- &lt;name&gt;.effects.ts (if not switched of by `--skip-effects`)
- &lt;name&gt;.reducer.ts
- &lt;name&gt;.selectors.ts
- &lt;name&gt;.state.ts

If no `--same-directory` is specified, subfolder called `state` is created and all files are placed there.

These files contain minimal set of code could be used out of the box.

#### page
Create set of libraries to be used as a single page.

This command will create multiple libraries under `{libsDir}/<name>` according to [best practices](https://youtu.be/B_-bH6gSpqU). They are:
- **models**. This library must be used for storing models any. Could be referenced by **data**, **feature** and **ui** modules.
- **data**. This library contains all data management code including state if flag `--skip-state`  was not specified. Could be referenced by **app** and **feature** module.
- **feature**. This library must be used for storing container components, having almost no layout and css, but has all the logic. Could be referenced by **data** module only
- **ui**. This library must be used for storing components supposed to have rendering features and no logic.

## Support
Please feel free to create pull requests with new features and/or bugfixes if any.
Please feel free to create feature requests.