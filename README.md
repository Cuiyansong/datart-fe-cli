# Datart FrontEnd CLI

> Use real CLI to setup frontend component, file, redux related and etc

[🌈Inspired by arminbro👏🏻](https://github.com/arminbro/generate-react-cli)
[More Opitons Infomation, please check here](https://github.com/arminbro/generate-react-cli#options)

## Installation

> Note: Please update package before use it, run command `npm update -g datart-fe-cli@latest`

run command `npm install -g datart-fe-cli@latest`

## How to Use

> Note: if not setup cli config, please run `datart-fe-cli component [ComponentName] --path=[ComponentRootPath]` step by step

### Convention
command alias:
    - component: c


[ComponentName]: the target component name, like `MyViz`
[ComponentRootPath]: the target component output path, like `dist/component`

### create standard component
run command `datart-fe-cli c [ComponentName] --path=[ComponentRootPath] --type=full`

### create cutomized standard component
run command `datart-fe-cli c [ComponentName] --path=[ComponentRootPath] --type=default [--withTest=false|--withStyle=false|--withLazy=false]`

### create `viz-style` component
run command `datart-fe-cli c [ComponentName] --path=[ComponentRootPath] --type=vizStyle`

## Development

> Note: if not setup cli config, please run `sudo node ./bin/generate` step by step

run `sudo node ./bin/generate component [ComponentName]`

## Publish to NPM

`npm publish .`
