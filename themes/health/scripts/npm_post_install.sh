#!/bin/bash

##
# Post npm install tasks.
##

npm rebuild node-sass

# Remove .info files from node_modules directory. INFO files in NPM packages can
# cause issues with Drush which associates .INFO files with Drupal modules and
# themes.
NODE_MODULES_DIR="$PWD/../node_modules"
if [ -d "$NODE_MODULES_DIR" ]; then
  find "$NODE_MODULES_DIR/" -name '*.info' -type f -delete
fi
