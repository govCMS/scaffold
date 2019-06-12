# GovCMS8 PaaS Project Scaffolding

## Known Issues

* Currently (Nov 2018), all local projects utilise the same LOCALDEV_URL - we are working to fix that.
* This repository is still a Work-in-Progress, and may be subject to slight alterations
* Currently the UI installs the GovCMS profile.  If you want a different profile (standard|minimal|custom) - you will have to install using `drush si`

## Requirements and Preliminary Setup

* [Docker](https://docs.docker.com/install/) - Follow documentation at https://docs.amazee.io/local_docker_development/local_docker_development.html to configure local development environment.

* [Mac/Linux](https://docs.amazee.io/local_docker_development/pygmy.html) - Make sure you don't have anything running on port 80 on the host machine (like a web server):

        gem install pygmy
        pygmy up

* [Windows](https://docs.amazee.io/local_docker_development/windows.html):

        git clone https://github.com/amazeeio/amazeeio-docker-windows amazeeio-docker-windows; cd amazeeio-docker-windows
        docker-compose up -d; cd ..

* [Ahoy (optional)](http://ahoy-cli.readthedocs.io/en/latest/#installation) - The commands are listed in `.ahoy.yml` all include their docker-compose versions for use on Windows, or on systems without Ahoy.

## Project Setup

1. Checkout project repo and confirm the path is in Docker's file sharing config (https://docs.docker.com/docker-for-mac/#file-sharing):

        Mac/Linux: git clone https://www.github.com/govcms/govcms8-scaffold-paas.git {INSERT_PROJECT_NAME} && cd $_
        Windows:   git clone https://www.github.com/govcms/govcms8-scaffold-paas.git {INSERT_PROJECT_NAME}; cd {INSERT_PROJECT_NAME}

2. Build and start the containers:

        Mac/Linux:  ahoy up
        Windows:    docker-compose up -d

3. Install Drupal Site using Composer:

        Mac/Linux:  ahoy composer install
        Windows:    docker-compose exec -T test composer install

4. Install GovCMS (use docker-compose version for other profiles e.g. standard):

        Mac/Linux:  ahoy install
        Windows:    docker-compose exec -T test drush si -y govcms

5. Login to Drupal:

        Mac/Linux:  ahoy login
        Windows:    docker-compose exec -T test drush uli

## Commands

Additional commands are listed in `.ahoy.yml`, or available from the command line `ahoy -v`

## Development

* This project installs Drupal in the `web` folder.
* All modules must be installed using composer - e.g. `ahoy composer require 'drupal/webform:^5.0'`.
* The `web/(modules|profiles|themes)/custom` are provided for any custom modules you need, and are committed to git.
* The `vendor`, `web/core` and `web/(modules|profiles|themes)/contrib` folders are created from the composer.json every time, and are not committed to git.
* Tests specific to your site can be committed to the `/tests` folders
* The files folder is not (currently) committed to GitLab.
* This project includes configuration based on the [GovCMS SaaS scaffold](https://github.com/govCMS/govcms8-scaffold) - e.g., `docker-compose.yml`, `.gitlab-ci.yml`, `.lagoon.yml`, and `.version.yml`. As a PaaS customer, you're able to modify this configuration. We don't recommend doing this unless you know what you're doing. You might break your website, or your ability to deploy your project.

## Stage File Proxy

Stage File Proxy is already configured for use in both local development and cloud development environments. To enable:
  - Add the `stage_file_proxy` module to your codebase
  - Uncomment the relevant lines in `.docker/scripts/govcms-deploy`

This will ensure SFP is enabled on non-prod environments in Lagoon.

## Fetching a production database for development

GovCMS on Lagoon takes nightly backups of your site.

Your production database backup is packaged inside a MariaDB image and pushed to your project's Container Registry inside Gitlab. You can pull this image locally to work with a copy of your site's database.

To do this:

1. Your site must already be deployed and running on Lagoon, so that a database backup exists. Check the Container Registry for your project inside Gitlab - it's the "Registry" link in the left nav. You should see a recent image named "*org*/*project*/**mariadb-drupal-data**"
2. Log in to your project's registry locally. See the instructions on your project's Container Registry page, under "How to use the Container Registry":
   1. `docker login gitlab-registry-production.govcms.amazee.io`
   2. GovCMS Gitlab uses TFA, so you'll need to use a [personal access token](https://projects.govcms.gov.au/profile/personal_access_tokens) to log in
3. Copy `.env.defaults` to `.env`, and make these changes:
   1. Uncomment the line starting with `MARIADB_DATA_IMAGE`
   2. Replace *org* and *project* with the correct values for your Gitlab project. This should match the name of the backup image in the Container Registry
4. Run `ahoy refresh-db`
5. Enjoy your fresh production database for local development!

## Image inheritance

This project is designed to provision a Drupal 8 project onto GovCMS PaaS, using the GovCMS8 distribution (or defaults), and has been prepared thus.

1. The vanilla GovCMS8 Distribution is available at [Github Source](https://github.com/govcms/govcms8) and as [Public DockerHub images](https://hub.docker.com/r/govcms8)
2. Those GovCMS8 images are then customised for Lagoon and GovCMS, and are available at [Github Source](https://github.com/govcms/govcms8lagoon) and as [Public DockerHub images](https://hub.docker.com/r/govcms8lagoon)
3. Those GovCMS8lagoon images are then retrieved in this scaffold repository.
4. This scaffold repository removes the /app folder from those images, allowing the project to deploy it's own site.
