# Theme Starter Kit
## Introduction

The Health Starter Kit (HSK) provides the framework for creating your own custom theme by extending the existing Health theme.

## Requirements

To work with the subtheme starter kit (SSK) you will need the following installed:

- [Node.js](https://nodejs.org/en/) - tested with v12.x.
- [Node Version Manager](https://github.com/nvm-sh/nvm) (NVM) - optional, but strongly recommended.

## Setup

The following setup instruction assume you have installed NVM.

- Open a command line terminal in the root of the Health theme directory.

- Switch to the correct version of Node.js.

        nvm use

- Generate new subtheme using the `create-subtheme` command. You will need to provide your new theme name (e.g. foo) as an argument.

        npm run create-subtheme foo

- Go to root directory of your newly created subtheme.

        cd ../foo

- Make sure you are using the correct version of Node.js.

        nvm use

- Install any required dependencies.

        npm install

## Structure

The following is an overview of the subtheme structure.

```
+- build/
|    |
|    +- css/
|    +- js/
|
+- scripts/
|
+- source/
|   |
|   +- js/
|   |
|   +- sass/
|       |
|       +- base/
|       |   |
|       |   +- _colours.scss
|       |
|       +- components/
|       |   |
|       |   +- @govau/
|       |   |
|       |   +- @health/
|       |   |   |
|       |   |   +- _card.scss
|       |   |   +- _hero.scss
|       |   |
|       |   +- MY_THEME/
|       |       |
|       |       +- _my_custom_component.scss
|       |
|       +- _hacks.scss
|       +- ckeditor.scss
|       +- styles.scss
|
+- templates/
|
+- MY_THEME.info.yml
+- MY_THEME.libraries.yml
+- MY_THEME.theme
```

| Directory | Notes |
|-----------|-------|
| `build/css` | Compiled CSS files. These files should not be directly modified. |
| `build/js` | Compiled JavaScript files.  These files should not be directly modified. |
| `scripts/` | Theme provide scripts used by the theme when setting up local development environment. You should not place project custom scripts in this directory. Custom JavaScript code should be place in `source/js/` directory. |
| `source/js/` | Custom JavaScript code. |
| `source/js/libraries/` | Third party JavaScript libraries required by the site. |
| `source/sass/base` | Recommended for subtheme variables including custom colours. |
| `source/sass/components/@govau/` | Custom overrides to components provided by the DTA Design System. |
| `source/sass/components/@health/` | Custom overrides to components provided by the Health Design System. |
| `source/sass/components/{THEME_NAME}` | Custom styles for any components created specifically for the project. |
| `templates/` | Twig template overrides. |

## Compiling CSS & JavaScript

Subtheme CSS and JavaScript is compiled using Gulp, which is installed when you ran `npm install` during the subtheme setup process. The following commands are supported:

| Command | Description |
|---------|-------------|
| `npm run gulp prod` | Compiles CSS and JavaScript for use in a production environment. This minifies relevant compiled files to reduce the size of built files. |
| `npm run gulp dev` | Compiles CSS and JavaScript for use in a development environment. Compiled files are not minified to facilitate easier debugging. |
| `npm run gulp watch` | Watches for changes in the `source/js/` and `source/sass/` directories and automatically recompiles these files when a change is detected. Compiled files are not minified to facilitate easier debugging. |
| `npm run gulp` | Is the equivalent of running `npm run gulp prod`. |
