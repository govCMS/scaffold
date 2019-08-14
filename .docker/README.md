# Docker strategies

This file describes all the high-level logic in the Dockerfiles. It should
possibly move to the wiki, but need a permalink for it right now as it is
linked to from all the Dockerfiles.

## Dockerfile build order

PHP, Nginx and Test all have a build dependency on CLI. This is mainly because 
we copy `/app` files from a fully build CLI container.

* Dockerfile.**cli**
  * Dockerfile.**php**
  * Dockerfile.**nginx-drupal**
  * Dockerfile.**test**
* Dockerfile.**solr**
* Dockerfile.**...** (as applicable)

## Example GovCMS Dockerfile

This is documented here to avoid duplication in Dockerfiles. If you
write a new Dockerfile please link back to {LINK TODO}

```
# CLI_IMAGE is available for any container to copy artifacts from
# a fully built `cli` image. The concept is from Lagoon. Lagoon
# injects the argument as a --build-arg. Locally we emulate the
# process with docker-compose.yml (see that file for more info).
ARG CLI_IMAGE

# A version tag may be passed in from .env or .env.default locally,
# or via GraphQL "buildtime" variable on Lagoon. It allows pulling
# images from alternative tags like :beta or :7.3.2. The `=latest`
# here only applies if the build argument is *not* set.
ARG GOVCMS_IMAGE_VERSION=latest

# Tells Docker to prep the CLI container for copying in assets.
FROM ${CLI_IMAGE} as cli

# The base image from https://hub.docker.com/u/govcms8lagoon
# The version currently defaults to :latest. `govcms8lagoon/nginx-drupal`
# will be a generic container built from an `amazee/nginx-drupal` container,
# in some cases with very little additional logic. Having the intermediary
# container allows us to do things like create a full set of images with
# a different verions of PHP, and so on.
FROM govcms8lagoon/php:${GOVCMS_IMAGE_VERSION}

# Since we are building from a generic upstream govcms container, we
# effectively can't trust the files in it (this may improve in future
# as we work to ensure this directory is empty upstream).
RUN rm -rf /app

# Copying files from the CLI is the main usage. Note that it can lead
# to superflous files.
COPY --from=cli /app/web /app/web
```

## Images

### Dockerfile.cli

AKA Dockerfile.govcms

The base image containers tools like composer and npm, so the full
Drupal application, and all testing dependencies, is built here first.
This image is then used as a template for building other images. In
production it becomes the CLI entry point for operations such as Disaster
Recovery backups.

### Dockerfile.nginx-drupal

This is Nginx built for Drupal; supporting common security and other
features link clean URLs. It only needs static files in /app/web, any
PHP requests are handed to PHP.

### Dockerfile.php

A clean PHP FPM container based on {LINK}. The nginx container hands
control to this container to execute any PHP, so it needs the full
/app including /app/vendor.

### Dockerfile.test

This is only build outside of Lagoon, and is what is used to run
full tests.

### Other images

Solr, Redis, Chrome are usually built generically, and rarely will have a
Dockerfile. They will be referenced directly from docker-compose.yml (which
is where Lagoon looks for them too).
