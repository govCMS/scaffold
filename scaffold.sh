#!/usr/bin/env bash

#
# Provision script for the GovCMS Scaffold.
#

self=$0

usage () {
  cat <<HELP_USAGE
  Prepare the scaffold directory for project use.

  Usage:
    $ scaffold.sh -t <type>

    -h    Print this message
    -t    Type of GovCMS project to scaffold
HELP_USAGE
  exit 2
}

finish () {
  echo "[success]: Scaffold created!"; rm "$self"
}

while getopts 'ht:' o
do
  case $o in
    t ) GOVCMS_TYPE=$OPTARG ;;
    h|? ) usage ;;
  esac
done

echo "Preparing GovCMS Scaffold"

if [[ "$GOVCMS_TYPE" != "saas" && "$GOVCMS_TYPE" != "paas" && "$GOVCMS_TYPE" != "saasplus" ]]; then
  echo "[error]: Valid scaffold type required, must be (saas, saasplus or paas)."
  exit 2
fi

echo "[info]: Preparing scaffold for $GOVCMS_TYPE"

sed -i.bak "s/{{ GOVCMS_TYPE }}/$GOVCMS_TYPE/" .version.yml && rm .version.yml.bak
sed -i.bak "s/{{ GOVCMS_TYPE }}/$GOVCMS_TYPE/" docker-compose.yml && rm docker-compose.yml.bak

if [[ "$GOVCMS_TYPE" != "paas" ]]; then
  rm -rf web scripts web drush

  cat >> .gitignore << 'EOF'

# Added by the scaffold provisioner.
web/
scripts/
drush/
EOF
fi

# trap finish EXIT
