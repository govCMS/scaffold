# GovCMS PaaS On-boarding

This document is applicable when you have been provisioned a GovCMS PaaS site. You should
read this before beginning your site build or migration, as there are choices you can make
now which will effect your project for many years.

This document will break down these choices, explain the defaults, and help guide you to 
decide what features you may want to change.

This document is technical. If your site is being built by a vendor you should request 
them to review this and offer an explanation for any choices made.

## History of the current PaaS structure

Initially PaaS sites had a custom "scaffold" that was an un-opinionated Drupal project
plus the GovCMS profile. Clients who needed to make simple alterations (SaaS plus a litte
sugar) didn't have any guide rails and might replace the whole setup with a 
bespoke Drupal application that wasn't best practice. Additionally, the GovCMS support
teams had two maintain two scaffolds with a lot of duplicated settings.

Some changes to were made in about 2020 to get the PaaS structure "more like SaaS" and
enable small additions without drastically altering the GovCMS building blocks. Some
features included:

  * Allow patches and extra modules without modifying the composer.json
  * Allow custom commands without modifying the `.ahoy.yml`
  * Allow enabling and disabling different types of tests without modifying `.gitlab-ci.yml`
  * Allow customisation of $settings and other aspects in web/sites/default without modifying default files.
  * Include Lagoon-friendly Drupal settings from separate package that worked equally well for SaaS and PaaS

You can see that most of these changes enable custom functionality from the core SaaS
product, without butchering the core product. One of the goals was to enable future
"SaaS+" options, and provide a migration path from simple PaaS sites to move back to SaaS.
(Ship Shape or the Site Audit CI job can tell you how close your PaaS site is to SaaS.)

## How much customisation is too much customisation?

The biggest risk of customising your PaaS site is that both a) it no longer resembles a
'normal' SaaS site and b) it doesn't resemble a 'normal' Drupal site either.

The less customisation the better! However, the goal here is to hint at the tipping point
where you would be better off making your site  "more like generic Drupal".  In this way
you can leverage the brains trust of the wider Drupal community, eg. the `#australia-nz` channel 
in Drupal Slack.

## Your README

You should replace your README.md with custom content the describes your project and any
key links, practices and decisions. It is misleading to leave the default README as it is
- your project is a website, not a scaffold - but you can definitely link to the original
README in the scaffold so that the reader understands the history. 

## The custom/composer directory.

The `custom/composer/composer.json` file was created so that edge cases could be solved
by GovCMS team without modifying a SaaS setup. It has no real benefit for PaaS projects.

This also applies to `custom/composer/patches.json`. 

Side note: it's not a bad idea to specify a directory like `custom` where you put your
custom stuff. This helps other developers clearly understand what is vanilla and what is
custom.

## Profile vs Packages

You are on PaaS so the expectation is you'll need to add new Composer packages (ie Drupal
modules). Unfortunately since the GovCMS distribution "pins" packages for auditing and
control reasons, the more packages you add, the more you increase the chance that
Composer can't resolve the dependency tree. 

*What you can change*

If you are building a very custom site, you should remove the "govcms/govcms" requirement
and simply require the packages you want. Don't pin your packages! Pinned packages are not
recommended by Composer so you should be doing things in a generic way.

*Risks/benefits*

If you add a lot of modules is you could get stuck unable to update with Composer. If this
happens with a security update you may need to find and apply patches. It can be gnarly
resolving these issues and you don't want to be managing a lot of patches and packages forks.

But should you make this change? This is really up to the team supporting your site. The 
main point to remember: "Requiring the GovCMS profile will make my site harder to support
the more that I customise it."

## About the profile

Everything the GovCMS profile does could be done in a module. The main exception is that 
customising the installer is best done in the profile, but after the site is installed that
will never be used again.

*What you can change*

You can install Drupal without the GovCMS profile, that's something you'd want to do from 
the outset.

*Risks/benefits*

If you read through the code of the profile, it's mostly about SaaS control. The downside
is the GovCMS installer setups up security very well. If you want to follow SaaS practices, 
say for consistency across your sites, you need to set it up TFA/etc manually by emulating
the configuration. There is an issue about this here https://github.com/govCMS/GovCMS/issues/913

## Settings.php and friends

All the Lagoon configuration is loaded from `vendor/govcms/govcms-scaffold`. This practice
is very common with other hosting platforms like Platform.sh or Pantheon. 

Read through the default `sites/default/settings.php` carefullky as it has some tips for
customisation your settings without messing too much with local Docker Compose and remote
Lagoon configuration.

Between `settings.local.php` (not committed to the repository) and `project.settings.php`
there is no need to edit any of the default setup.

## Understand your deployment processes

When deploying your site there are processes and settings that are different depending on
which environment the deployment is occurring: local/development/production. Locally you
can replicate deployment with `ahoy govcms-deploy`.

There are some settings in the `.env` file which will impact what happens when your site is
being deployed. You can read about these in the support documentation - they are all settings
you should consider with regards to your team's preferred workflow.

*`GOVCMS_DEPLOY_WORKFLOW_CONFIG`*

Controls whether to import config from `config/default`. Setting this to `import` is 
common for teams to control all config. Note that any config in `config/dev` will be
imported during this process.

Setting this to `retain` is used if settings are changed through the UI by site builders.

*`GOVCMS_DEPLOY_WORKFLOW_CONTENT`*

Controls whether to sync production database on deployment. This is off by default - you 
wouldn't want to sync a large database on deployment to a dev environment!

*`GOVCMS_DEPLOY_ENABLE_MODULES`*

By default this is enabled and will force install various modules, but all these modules
can be installed through your config, so you are better to control any variations with 
config_ignore or config_split.

## Ahoy commands

The `.ahoy.yml` is set up so you can put custom commands in the `custom/ahoy.yml`. If you 
have started to move composer packages and patches into your composer.json and you're
not using `custom/` for anything, you might consider adding your custom commands straight
to the main `.ahoy.yml`, clearly labelled at the bottom.'

## Gitlab CI configuration

The `.gitlab-ci.yml` and `.gitlab-ci-inputs.yml` is very abstracted setup that is desiged
to allow various types of tests to be turned on and off. A custom .gitlab-ci.yml can be
faster and easier to understand and customise.

For example, here's a fast CI setup that just checks for coding standards and shows a
deployment message, which is great for teams that are not writing behat/phpunit tests.

```
---
image: gitlab-registry-production.govcms.amazee.io/govcms/govcms-ci${GOVCMS_CI_IMAGE_VERSION}

stages:
  - testing
  - deploy

lint:
  before_script:
    - composer install
  stage: testing
  script:
    - ./vendor/bin/phpcs -s --standard=tests/phpcs.xml --extensions='php,module,theme' ./web/*/custom
  allow_failure: true

# Deploy summary.
notice:
  variables:
    GOVCMS_DASHBOARD: "https://dashboard.govcms.gov.au/projects"
  script:
    - echo "Deployment has been triggered on Lagoon. See $GOVCMS_DASHBOARD/$CI_PROJECT_NAME/$CI_PROJECT_NAME-$(echo $CI_COMMIT_REF_NAME | sed -e 's/[^[:alnum:]-]/-/g')/deployments"
  stage: deploy
```




