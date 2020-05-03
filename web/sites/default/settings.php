<?php

/**
 * @file
 * Drupal settings entry point.
 *
 * Do you need to override or set defaults? Check the stories below:
 *
 * As a developer ...
 *
 * `I want to override some settings just for me.
 *
 *   Create a web/sites/default/settings.local.php (this isn't committed to
 *   Git). There an example.settings.local.php to get you started.
 *
 * `I want to override some settings for this project everywhere it runs.
 *
 *   You can update web/sites/default/settings.project.php. See that file for
 *   more information.
 *
 * `I want to run an alternative local development environment.
 *
 *   You can use "project.settings.php" to add any variables you need. Or better
 *   to include an additional file eg web/sites/default/lando.settings.php. Make
 *   sure the LAGOON environment variable is not set. And set LAGOON_ENVIRONMENT_TYPE
 *   to 'local'.
 *
 * `I don't like these settings, my project is PaaS, and I want to have lot more control.
 *
 *   Have a look at lagoon.settings.php to understand what needs to be set to
 *   run a site on Lagoon. Our recommendation is that you include this file and
 *   override it at the project.settings.php level.
 *
 * `I feel like there are some settings that should be the same for every GovCMS site.
 *
 *   We welcome your observations! Check out [link to come].
 */

// Set by Drupal core.
/* @var $app_root string */

// Path to standardized platform-wide settings includes.
/* @var $govcms_includes string */

// Set to 'local', 'development', 'production'.
/* @var $govcms_env string */

$govcms_includes = $app_root . '/../vendor/govcms/scaffold-tooling/drupal/settings';

include $govcms_includes . '/all.settings.php';

// Every Lagoon, local or remote.
if (getenv('LAGOON')) {
  include $govcms_includes . '/lagoon.settings.php';
}

// Prod vs Dev specific overrides.
if (getenv('LAGOON_ENVIRONMENT_TYPE') && getenv('LAGOON_ENVIRONMENT_TYPE') == 'production') {
  include $govcms_includes . '/production.settings.php';
}

if (getenv('DEV_MODE') && getenv('DEV_MODE') == 'true') {
  include $govcms_includes . '/development.settings.php';
}

// Project specific overrides.
if (file_exists($app_root . '/sites/default/project.settings.php')) {
  include $app_root . '/sites/default/project.settings.php';
}

// Local uncommitted overrides.
if (file_exists($app_root . '/sites/default/settings.local.php')) {
  include $app_root . '/sites/default/settings.local.php';
}
