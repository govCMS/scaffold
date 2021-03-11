# Health Sample Content

Generates sample content for a site using the Health Starter Kit (HSK).

### Prerequisites <a id="sample-content-prerequisites"></a>

Assumes you have an instance of the Drupal site which was provisioned using the HSK configuraiton. Sample content is generated via Drupal's migration system and relies on several contributed modules which are not including in the GovCMS8 distribution. These modules will need to be installed in your local development environment by running `composer install` from your project's root directory (see the [HSK installation instructions](#installation) for more details).

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

It should be noted that when sample content is removed using this method the Solr search index is not updated. This can lead to issues where search result counts are greater than the amount of content in the site. To rectify this you may need to destroy and then rebuild your  `hsk_solr_1` docker container
