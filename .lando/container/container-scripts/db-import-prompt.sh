#!/bin/bash
set -e

# Get the lando logger
. /helpers/log.sh

mysql() {
  # Avoid sandbox comment due to different client versions on cli vs mariadb
  # containers.
  # @see https://github.com/govCMS/scaffold/issues/133
  if ! test -t 0; then
    awk 'NR == 1 && /\/\*M\!999999\\\- enable the sandbox mode \*\// {next} {print}' | command mysql "$@"
  else
    command mysql "$@"
  fi
}
# Pass to sub bash script.
export -f mysql

echo "Do you really want to import the database file? (yes/no) [no]:"
read -r -p " > " response;
if [ ! "${response}" = "y" ] && [ ! "${response}" = "yes" ]; then
  # Abort.
  lando_red "Cancelled."
else
  bash -c "$*"
fi
