# Webinizer webclient

> [!IMPORTANT]\
> Webinizer is now in **_Beta_** trial. We'd greatly appreciate your feedback!

## About

Webinizer is a collection of tools to convert native applications, such as these programmed by
C/C++/Rust, to Web applications which are constructed by HTML/CSS/JavaScript and WebAssembly.

Webinizer consists of two parts; a core engine that analyzes the code and then either fixes or
highlights issues, and a web frontend to configure projects and display results. This repo is the
web frontend, for the core engine see the [webinizer](https://github.com/intel/webinizer) repo.

We also provide the [webinizer-demo](https://github.com/intel/webinizer-demo) repo that holds the
demo projects and build scripts to setup Webinizer.

## Setting up the development environment for webclient

The webclient is developed using `Vue 3 + TypeScript + Vite`.

### Basic commands

- `npm run dev` to launch the webclient server in `development` mode and start at port 18888.
- `npm run serve` to launch the webclient server in `production` mode and start at port 18888.
- `npm run lint` to format code with ESLint.

### Recommended IDE setup

It's preferred to use [VS Code](https://code.visualstudio.com/) with
[Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) for development.

It's preferred to use Prettier formatter, along with `Format on Save`. Please setup the
[Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and
[ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) extensions and
configure them accordingly.

NOTE that we set printWidth as 100 and tab width as 2.

#### Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic
Vue component type by default. In most cases this is fine if you don't really care about component
prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports
(for example to get props validation when using manual `h(...)` calls), you can enable Volar's Take
Over mode by following these steps:

1. Run `Extensions: Show Built-in Extensions` from VS Code's command palette, look for
   `TypeScript and JavaScript Language Features`, then right click and select `Disable (Workspace)`.
   By default, Take Over mode will enable itself if the default TypeScript extension is disabled.
2. Reload the VS Code window by running `Developer: Reload Window` from the command palette.

You can learn more about Take Over mode
[here](https://github.com/johnsoncodehk/volar/discussions/471).

## Contributing

We welcome contributions to Webinizer webclient. You can find more details in
[CONTRIBUTING.md](CONTRIBUTING.md) .
