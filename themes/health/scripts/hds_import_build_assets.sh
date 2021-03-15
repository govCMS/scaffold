#!/bin/bash

###
# Import Health Design System build assets into the current theme.
#
# Copies CSS, JS and library assets from the Health Design System into the
# Health theme.
##

THEME_HDS_ASSETS_DIR_NAME="health_design_system"
HDS_BUILD_DIR="$PWD/../node_modules/@health.gov.au/health-design-system/build"
HDS_SOURCE_DIR="$PWD/../node_modules/@health.gov.au/health-design-system/source"
HDS_COMPONENTS_DIR="$PWD/../node_modules/@health.gov.au/health-design-system/style-guide/components"

# Process health_design_system directory in order to store assets.
if [ -d "$PWD/../$THEME_HDS_ASSETS_DIR_NAME" ]; then
  rm -Rf "$PWD/../$THEME_HDS_ASSETS_DIR_NAME/*"
else
  mkdir "$PWD/../$THEME_HDS_ASSETS_DIR_NAME"
fi

# Copy assets from the Health Design System into the current theme.
if [ -d $HDS_BUILD_DIR ]; then
  cp -a "$HDS_BUILD_DIR"  "$PWD/../$THEME_HDS_ASSETS_DIR_NAME/"
fi
if [ -d $HDS_SOURCE_DIR ]; then
  cp -a "$HDS_SOURCE_DIR"  "$PWD/../$THEME_HDS_ASSETS_DIR_NAME/"
fi
if [ -d $HDS_COMPONENTS_DIR ]; then
  cp -a "$HDS_COMPONENTS_DIR"  "$PWD/../$THEME_HDS_ASSETS_DIR_NAME/"
fi
