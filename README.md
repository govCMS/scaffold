# Awesome Starter Kit (ASK)

This documentation assumes you are using MacOS or Linux as your host environment.

## Table of contents

  - [Prerequistes](#prerequisites)
  - [Create new project based on ASK](#create-new-project-based-on-ask)
    - [Create new Git project](#create-new-git-project)
    - [Installation](#installation)
    - [Post installation tasks](#post-installation-tasks)
  - [App or Tool integration](#app-or-tool-integration)
    - [Path](#path)
    - [Using Composer](#using-composer)
    - [Define app package](#define-app-package)
    - [Add app to site codebase](#add-app-to-site-codebase)
    - [Update an app](#update-an-app)
  - [GovCMS integration](#govcms-integration)
  - [ASK development](#ask-development)
    - [Adding modules](#adding-modules)
      - [Contrib modules](#contrib-modules)
      - [Custom modules](#custom-modules)
    - [Adding themes](#adding-themes)
      - [Contributed themes](#contributed-themes)
      - [Custom themes](#custom-themes)
      - [Health subtheme](#health-subtheme)
    - [Configuration management](#configuration-management)
      - [Custom config changes](#custom-config-changes)
      - [GovCMS8 distribution updates](#govcms8-distribution-updates)
      - [Scaffolding change management](#scaffolding-change-management)
  - [Functional tests](#functional-tests)
  - [Generating Sample Content](#generating-sample-content)
    - [Prerequisites](#sample-content-prerequisites)
    - [Installation](#sample-content-installation)
    - [Import sample content](#import-sample-content)
    - [Remove imported content](#remove-imported-content)
  - [Visual regression tests](#visual-regression-tests)
    - [Local (Backstop.js)](#local-backstopjs)
    - [Remote (Cypress/Percy)](#remote-cypresspercy)
  - [Coding standards](#coding-standards)
- [PHP debugging](#php-debugging)
  - [Enabling xdebug](#enabling-xdebug)
    - [Edit the codebase](#edit-the-codebase)
    - [Configure your IDE to use Xdebug](#configure-your-ide-to-use-xdebug)
    - [VSCode setup](#vscode-setup)
      - [Configure Edge Chromium browser to work with Xdebug and VSCode](#configure-edge-chromium-browser-to-work-with-xdebug-and-vscode)
  - [PHPStorm setup](#phpstorm-setup)
  - [Funnelback](#funnelback)
  - [Troubleshooting](#troubleshooting)
    - [Solr](#solr)
    - [Results counts in listings and facets](#results-counts-in-listings-and-facets)
  - [Docker](#docker)
    - [No space left of devices in Docker for Mac](#no-space-left-of-devices-in-docker-for-mac)
  - [Search](#search)
    - [Access Solr server UI](#access-solr-server-ui)

## Prerequisites

- [Homebrew](https://brew.sh) (OSX operating systems only)
- [Node](https://treehouse.github.io/installation-guides/mac/node-mac.html)
- [Ruby](https://www.ruby-lang.org/en/documentation/installation/#homebrew)
- [Docker](https://docs.docker.com/install/)
- [Pygmy](https://pygmy.readthedocs.io/en/master/)
- [Ahoy](https://github.com/ahoy-cli/ahoy)

## Create new project based on ASK

### Create new Git project

1. Create a new project repository in your Github, Gitlab or Bitbucket account.

1. Clone starter kit repository locally.

        git clone https://github.com/healthgovau/ask.git MYPROJECT

1. Change to new project directory

        cd MYPROJECT

1. Unlink the remote ASK repository from your project

        git remote remove origin

1. Add the new remote repository created in step 1 as a remote

        git remote add origin https://github.com:healthgovau/MYPROJECT.git


### Installation

The following instructions provide information on how to provision a new site.

1. Install project dependencies

        composer install

1. Set the values of the `COMPOSE_PROJECT_NAME`, `LOCALDEV_URL`, `STAGE_FILE_PROXY_URL` in the `.env` file to match your project name. For example, `LOCALDEV_URL=http://MYPROJECT.govcms.docker.amazee.io`.

1. Start ahoy:

        ahoy up

1. SSH into drush container

        ahoy cli

1. Install site

        drush site:install --existing-config

1. Exit drush container

        exit

### Post installation tasks

1. SSH into the drush container

        ahoy cli

1. Set super user name, password and email address. Login in as super user `drush uli`. Set User name and password. User name should be a random string of at least 20 characters.

1. Block super user account: `drush user:block USERNAME`


## App or Tool integration

Client side applications or tools can be embedded into a page using the App or Tool paragraph type.

### Path
An app or tool will have its own folder in the health theme apps folder (themes/health/apps).

Apps must use paths relative to the root of the drupal installation for loading of resources (eg CSS,JS,JSON) `/sites/default/themes/custom/health/apps/APP_NAME`. This path is available at runtime via `#app-tool-container` `data-path` attribute.

### Using Composer

Externally create apps can be integrated into the site theme via Composer. Currently Reach based apps are supported. To integrated an app:

#### Define app package
You need to define the app in the `{PROJECT_ROOT}/composer.json` file. See following examples of how to define Git hosted projects as packages.

Example One: Define package which will build the app project by cloning the source code from the master branch.
```json
...
"repositories": [
    {
      "type": "package",
      "package": {
        "name": "healthgovau/out-of-pocket",
        "version": "1.0.0",
        "type": "health-app-react",
        "source": {
          "type": "git",
          "url": "git@github.com:healthgovau/out-of-pocket.git",
          "reference": "master"
        }
      }
    }
]
...
```
Example Two: Define package which will build the app project based on a ZIP based release hosted on Github.
```json
...
"repositories": [
    {
      "type": "package",
      "package": {
        "name": "healthgovau/hospital-funding-estimator",
        "version": "1.1.0",
        "type": "health-app-react",
        "dist": {
          "type": "zip",
          "url": "https://github.com:healthgovau/out-of-pocket/archive/1.1.0.zip"
        }
      }
    }
]
...
```

| Parameter | Notes |
| --- | --- |
| package:name | You can name the package whatever you wish; however, if the app is hosted on Github or Bitbucket (e.g. `https://github.com/healthgovau/out-of-pocket`) then it is suggested that you use the group and project name (e.g. `healthgovau/out-of-pocket`). |
| package:type | values: `health-app-react`. Informs Composer that this package contains a React based app. |
| package:version | Should follow the versioning of the app project. If the app project does not utilise versioning then you can create you own version. You should follow best practice semantic versioning rules. |

#### Add app to site codebase

Add the app using Composer using the package name.

```sh
composer require healthgovau/out-of-pocket
```

During the installation process you will be asked the following:

| Question | Description |
| --- | --- |
| Is this a production build? | Respond `n` to enable app console logging or if you want to use local dev version of the app (e.g. you want to run the app dev environment using `npm run start`). |
| Remove static CSS links from project? | Will be asked when importing a React app. It is designed to support legacy apps which use the CSS stylesheets provided by the host site. Responding `y` will result in links to CSS files in `build/static/css` directory being removed from the app. This process effectively removes all CSS files compiled directly by the React app. The use of apps which are fully decoupled from the host site are strongly encouraged. In such case on would not remove static CSS links. Please consult with the app developer or app project manager if you are unclear whether or not these static CSS files should be included or not. |

#### Update an app

The recommended approach to updating an app is to reinstall it.

1. Remove the existing app.

```sh
composer remove healthgovau/out-of-pocket
```

2. Update the package definition in `{PROJECT_ROOT}/composer.json`. This may not be necessary in all cases. For example if the package is based on a branch rather than a specific tag or release, then no changes would be required.

3. Install the package

```sh
composer require healthgovau/out-of-pocket
```


## GovCMS integration

[**TODO** - this section needs to be revised]

1. Commit any changes and push to the project hosted on github.com/healthgovau.

1. Contact GovCMS and ask them to provision a new site based on the project source code. You will need to make sure that GovCMS has access to the project repository. Be sure to ask them to enable configuration importing during code deployments and the provide a Solr container.

1. Once GovCMS has provisioned a new environment, you will no longer need the project repository created in previous steps. For security reasons GovCMS can not directly use the repository. They must create a new one based on the configuration and themes provided in the previously created repository. You will need to clone this GovCMS created repository locally for any future development work on the new site.

1. Download the project master database for Lagoon and import it locally.

        ahoy mysql-import DATABASE_SNAPSHOT.sql
        ahoy drush pm:enable stage_file_proxy

1. Enable the Password Policy module and submodules

        drush pm:enable password_policy password_policy_length password_policy_characters password_policy_character_types password_policy_history password_policy_username

1. Export Password Policy module and export the related configuration to the codebase. Due to a bug the Password Policy configuraiton cannot be provisioned when initial installing the site. It must be enabled post site install. **Note:** be careful to only export Password Policy related settings. Don't export the stage_file_proxy settings.

1. Push these changes back to repo on Gitlab.


## ASK development

The following sections describe various workflows used when developing for the HSK.

### Adding modules

One can add Drupal modules for use in the local development environment. Depending on the type of module they will be added to the `dev_modules/contrib/` or `dev_modules/custom/` directories accordingly.

> **Note**: modules added this way are only available in the local development environment. They will not be available in non-local (e.g. production, develop) environments.

#### Contrib modules

Contributed Drupal modules can be installed using composer. Not the installation process is slightly different to the method used in a regular Drupal composer project. Please follow the following steps carefully:

1. Check the module's dependencies. This can be done by inspecting the module's `composer.json` file. For any dependencies you don't want to install (e.g. those dependencies already exist in the GovCMS distribution) then you should exclude then by listing them in the `replace` property in the Starter Kit's `composer.json` file. For example:

        ...
        "replace": {
            "drupal/core": "*"
        },
        ...

1. Install the module:

        composer require drupal/migrate_tools

#### Custom modules

Any custom modules for use in the local development environment should be added to `dev_modules/custom/` directory.

### Adding themes

#### Contributed themes

Contributed themes can be added to the Starter Kit via Composer. Contrib themes added this way will be auutomattically added to the `themes/` directory.

        composer require drupal/adminimal_theme

#### Custom themes

Custom themes should be created in the `themes/` directory.

#### Health subtheme

If you wish to use the Health theme but want to modify it, then it is recommended that you create a sub-theme. Creating a sub-theme will enable you to modify or and new functionality to the site without having to change the Health theme directly.

We have made it easy for you to create a new subtheme. Detailed instructions on how to do this can be found in the `themes/health/MY_THEME/README.md` file.

### Configuration management

#### Custom config changes

[TODO (e.g. custom content types, views, etc.)]

#### GovCMS8 distribution updates

> **@TODO**: This needs to be rewritten since GovCMS8 Scaffold project has been replaced by Scaffold project.

The GovCMS8 distribution is periodically updated. It is important that any site configuration changes due to dustribution updates are incorporated into the starter kit codebase. The workflow for GovCMS8 distribution updates is as follows:

1. From the host system SSH into the drush container

        ahoy cli

1. Install the HSK site

        drush si  --existing-config

1. Clear site cache

        drush cr

1. Exit from the Drush container back into the host system

        exit

1. Get the number of the lastest release version of the [govcms8lagoon](https://github.com/govCMS/govcms8lagoon/releases) project

1. Update the `GOVCMS_IMAGE_VERSION` variable to the latest release version in each of these files

        .env
        .docker/Dockerfile.cli
        .docker/Dockerfile.nginx-drupal
        .docker/Dockerfile.php
        .docker/Dockerfile.solr
        .docker/Dockerfile.test

1. Rebuild the docker containers

        ahoy -f local.ahoy.yml rebuild

1. SSH back into the Drush container

        ahoy cli

1. Clear site caches

        drush cr

1. Run any database updates

        drush updatedb

1. Clear site caches

        drush cr

1. Check for any configuration changes

        drush config:status

1. If there are any resulting config changes then these should be exported to the HSK codebase

        drush cex sync

#### Scaffolding change management

> **@TODO**: This needs to be rewritten since GovCMS8 Scaffold project has been replaced by Scaffold project.

1. Add upstream remote if you have not done so already.

        git remote add upstream git@github.com:govCMS/scaffold.git

1. Merge the latest release with current git branch. You will need to confirm the correct name for the upstream branch to merge as there is some inconsistancy in how it is named between releases. At the time of writing the release branch name was `release/1.3.1`.

        git merge --no-ff upstream/release/1.3.1

1. Confirm that no custom changes to the ASK codebase has been overridden and commit any changes.

1. Remove the upstream repository.

        git remote remove upstream

1. Remove any Gits tags added from the upstream project from your local environment. This is necessary as we don't want to add any Git tags from the scaffolding project to the ASK project.

        // Get list of tags.
        git tag

        // Remove tag from local environment.
        git tag -d TAG_NAME

## Generating Sample Content

> These notes are a duplication of those from the README within the health_sample_content module.

Generates sample content for a site using the Awesome Starter Kit (ASK).

### Prerequisites <a id="sample-content-prerequisites"></a>

Assumes you have an instance of the Drupal site which was provisioned using the HSK configuraiton. Sample content is generated via Drupal's migration system and relies on several contributed modules which are not including in the GovCMS8 distribution. These modules will need to be installed in your local development environment by running `composer install` from your project's root directory (see the [ASK installation instructions](#installation) for more details).

### <a id="sample-content-installation"></a>Installation

- Install the Health Sample Content module and any dependencies. This can be done using Drush

        drush pm:enable health_sample_content

### Import sample content

- Clear site caches

        drush cr

- Run the migration

        drush mim --all

### Remove imported content

- Rollback the migration

        drush mr --all

It should be noted that when sample content is removed using this method the Solr search index is not updated. This can lead to issues where search result counts are greater than the amount of content in the site. To rectify this you may need to destroy and then rebuild your  `ask_solr_1` docker container

## Functional tests

The HSK provides tests using the [Cypress](https://www.cypress.io/) testing framework. Test scripts can be found in the `./cypress/integration/` directory. Tests can be run manually in the local development environment via npm.

        npm run cypress:run

In the case of a failed test a screenshot will be created in the `./cypress/screenshots/` directory.

It is possible to display the Cypress tests running in a locally installed browser by using one of the following commands.

        // Run tests in default Electron browser used by Cypress.
        npm run cypress:browser
        // Run tests in locally installed Chrome browser. You need to have Chrome locally installed to use.
        npm run cypress:browser:chrome
        // Run tests in locally installed Firefox browser. You need to have Firefox locally installed to use.
        npm run cypress:browser:firefox

**Note:** Cypress is also used to trigger visual regression tests using Percy. Locally run functional tests will not trigger visual regress tests in Percy due to absence of required token (see following section on _Visual regression tests_).

## Visual regression tests

The project implements local as well as remote visual regression testing via the [Backstop.js](https://github.com/garris/BackstopJS) and [Percy.io](https://percy.io/) frameworks respectively.

Percy.io was originally chosen due to it's out of the box integration with Github workflows and the Cypress testing engine.

Backstop.js was selected as an alternative due to the fact that it is open-source (i.e.free).

> __Note:__ It is likely that in the future only one of these testing methods will be used. Until then both methods are available.

### Local (Backstop.js)

Local visual regression tests can be performed using the Backstop.js integration. The reference images against which the site is compared can be found in the `backstop_data/bitmaps_reference/` directory.

To use:

- Make sure you have the relevant dependencies install

        npm install

- Run regression tests

        npm run backstop:run

- View the test report

        npm run backstop:open

- Check any reported changes. Any errors should be corrected before re-running the regression test. If the changes are acceptable (e.g. you have deliberately made changes to a page, then these need to be approved. Approved changes with be automattically copied to the `backstop_data/bitmaps_reference/` directory and should be comitted to the code repository.

        npm run backstop:approve

### Remote (Cypress/Percy)

The project makes use of [Cypress](https://www.cypress.io/) and [Percy](https://percy.io/) to implemented visual regression tests in Github workflow pipelines.

When creating or updating pull requests on `develop` or `master` branches snapshots of sample content type pages will be created and analysed by Percy. In case of a failure the results can be reviewed in Percy. Once approved in Percy one will be able to merge the pull request.

Cypress test configuration can be found in the `cypress/integration/` directory.

> **Note:** Cypress can also be used to create end-to-end functional tests.

## Coding standards

This project is configured to use PHP Code Sniffer check that custom module and theme code conforms to official Drupal coding [standards](https://www.drupal.org/docs/develop/standards/coding-standards). To check your code perform the following:

1. Install project dependencies if you have not done so already

        composer install

1. Confirm you are running correct version of npm

        nvm use

1. Run script to check custom code against Drupal coding standards

        npm run code:check

1. Review any reported issue and fix accordingly. You can also attempt to automatically fix reported coding issues.

        npm run code:fix

1. Note that the script may not be able to resolve all issues. If that is the case then run the coding standards check again and fix any any reported issues manually.

# PHP debugging

## Enabling xdebug

### Edit the codebase
Add `XDEBUG_ENABLE` and `DOCKERHOST` variables to the end of the project's `.env` file.

        ...
        XDEBUG_ENABLE=true
        DOCKERHOST=host.docker.internal

> **Note for Linux users**
>
> You will need to add the IP address of the Docker host instead of `host.docker.internal`. To get the IP address run `ip a` and then note the IP address of `docker0` adapter. Set `DOCKERHOST` to this IP address.

Start your local containers.

        ahoy up

If your local containers are already running, then you will need to restart them.

        ahoy stop && ahoy up

### Configure your IDE to use Xdebug
Below we offer instructions for the 2 most popular IDEs - VSCode and PHPStorm

#### VSCode setup

1. Copy `/app` directory from the container to you project.

        docker cp ask_cli_1:/app ./

1. Delete the custom the directory from the app directory.

        rm -Rf ./app/web/themes/custom

1. Edit `launch.json` file as per the following:

        {
          // Use IntelliSense to learn about possible attributes.
          // Hover to view descriptions of existing attributes.
          // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
          "version": "0.2.0",
          "configurations": [
            {
              "name": "Listen for XDebug in Drupal",
              "type": "php",
              "request": "launch",
              "port": 9000,
              "pathMappings": {
                "/app": "{/PATH/TO/PROJECT}/app",
                "/app/web/themes/custom": "{/PATH/TO/PROJECT}/themes"
              }
            },
            {
              "name": "Launch currently open script",
              "type": "php",
              "request": "launch",
              "program": "${file}",
              "cwd": "${fileDirname}",
              "port": 9000,
              "pathMappings": {
                "/app": "{/PATH/TO/PROJECT}/app",
                "/app/web/themes/custom": "{/PATH/TO/PROJECT}/themes"
              }
            }
          ]
        }

1. Configure your browser to work with Xdebug.

#### Configure Edge Chromium browser to work with Xdebug and VSCode

- Install the [Xdebug Helper](https://microsoftedge.microsoft.com/addons/detail/xdebug-helper/ggnngifabofaddiejjeagbaebkejomen) browser extension from the Microsoft store.
- Right mouse click on the Xdebug Helper icon in the browser toolbar and select "Extension options".
- Set the value of IDE Key to "other", enter "VSCODE" in the text field and then press "Save".

### PHPStorm setup

*Tested on PHPStorm v2019.x*

Copy remote /app folder into a local.

        docker cp hsk_cli_1:/app ./

*If the [distribution changes](Development/GovCMS-updates), this will need to be redone.*

In PHPStorm, go to Language and Frameworks > PHP > Servers
* Name: ask.docker.amazee.io
* Host: ask.docker.amazee.io
* Port: 80
* Debugger: Xdebug
* Check 'Use path mappings'
* Set paths
  * app -> /app
  * themes -> /app/sites/default/themes/custom

These are the original instructions for reference:

https://www.drupal.org/docs/7/modules/govcms/how-to-setup-xdebug-with-phpstorm

Note that this simply allows PHPStorm to add breakpoints and view variables, any changes made to the files in /app locally are not synced to the remote.

## Funnelback

To enable Funnelback search:

1. Go to Health theme settings, enable Funnelback and fill in the details.
1. Create a Search results node with the path /search/results.

The search form is in the health-header.html.twig template by default, but can be included anywhere.


## Troubleshooting

### Solr

Sometimes one may experience issues where Drupal is reporting that the Solr search in not reacheable or some similar error. A possible solution for this is to remove the existing Solr image and then rebuild the solr container. You can do this from the command line in your project directory.

        ahoy stop
        docker image remove hsk_solr
        ahoy up

### Results counts in listings and facets

One may encounter a situation where the result counts in facets and listing are not correct. This can occur when working with sample content where the sample content has been repeated imported then removed using the Drupal Migration API. This is caused by the content not being removed from the Solr index when rolling back migration content. If you experience this issue it is recommended that you rebuild the existing Solr container.

        ahoy stop
        docker image remove hsk_solr
        ahoy up

You may need to rebuild the search index in Drupal afterwards.

## Docker

### No space left of devices in Docker for Mac

This issue can occur when rebuilding containers. Inspection of the Docker for Mac admin tool shows there is plenty of room left in the virtual disk and yet Docker is still complaining about disk space. The issue is that different parts of Docker have different disk space limitations. The `docker system fs` is your friend here. See this article [here](https://www.percona.com/blog/2019/08/21/cleaning-docker-disk-space-usage/) for more information on how to use it and free up more space.

## Search

### Access Solr server UI

The Solr server provides an HTML based GUI interface which can be accessed as follows:

1. Get the port number of the Solr container.

        ahoy ps

   You should see something similar to this:

        hsk_solr_1  /sbin/tini -- /lagoon/entr ...  Up  0.0.0.0:32769->8983/tcp

   In this example the port number is `32769`

1. In your browser go the following address. Be sure to use the port number obtained is step 1.

        http://localhost:32769/solr/#/~cores/drupal

