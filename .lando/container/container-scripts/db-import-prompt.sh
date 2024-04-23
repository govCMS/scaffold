#!/bin/bash
set -e

# Get the lando logger
. /helpers/log.sh

echo "Do you really want to import the database file? (yes/no) [no]:"
read -r -p " > " response;
if [ ! "${response}" = "y" ] && [ ! "${response}" = "yes" ]; then
  # Abort.
  lando_red "Cancelled."
else
  bash -c "$*"
fi
