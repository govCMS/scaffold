#!/usr/bin/env bash

#
# Provision script for the GovCMS Scaffold.
#

self=$0

usage () {
  cat <<HELP_USAGE
  Prepare the scaffold directory for project use.
  Usage:
    $ scaffold.sh -t <type> -v <version> -n <name>
    -h    Print this message
    -t    Type of GovCMS project to scaffold
    -v    Version of GovCMS (7|8|9)
    -n    Name of project (machine name)
HELP_USAGE
  exit 2
}

finish () {
  echo "[success]: Scaffold created!"; rm "$self"
}

while getopts 'h:n:v:t:' o
do
  case $o in
    t ) GOVCMS_TYPE=$OPTARG ;;
    v ) GOVCMS_VERSION=$OPTARG ;;
    n ) GOVCMS_NAME=$OPTARG ;;
    h|? ) usage ;;
  esac
done

echo "Preparing GovCMS Scaffold"

if [[ "$GOVCMS_TYPE" != "saas" && "$GOVCMS_TYPE" != "paas" && "$GOVCMS_TYPE" != "saasplus" ]]; then
  echo "[error]: Valid scaffold type required, must be (saas, saasplus or paas)."
  exit 2
fi

if [[ "$GOVCMS_VERSION" != "7" && "$GOVCMS_VERSION" != "8" && "$GOVCMS_VERSION" != "9" ]]; then
  echo "[error]: Valid scaffold version required, must be (7, 8, 9)."
  exit 2
fi

if [[ "$GOVCMS_NAME" =~ [^a-z0-9-] ]]; then
  echo "[error]: Valid scaffold name required, must be alphanumeric lowercase. Hyphens are allowed."
  exit 2
fi


echo "[info]: Preparing scaffold for GovCMS$GOVCMS_VERSION ($GOVCMS_TYPE): $GOVCMS_NAME"

cp .env.default .env
sed -i.bak "s/{{ GOVCMS_PROJECT_NAME }}/$GOVCMS_NAME/" .env && rm .env.bak
sed -i.bak "s/{{ GOVCMS_PROJECT_NAME }}/$GOVCMS_NAME/" docker-compose.yml && rm docker-compose.yml.bak
sed -i.bak "s/{{ GOVCMS_TYPE }}/$GOVCMS_TYPE/" .version.yml && rm .version.yml.bak
sed -i.bak "s/{{ GOVCMS_TYPE }}/$GOVCMS_TYPE/" docker-compose.yml && rm docker-compose.yml.bak
sed -i.bak "s/{{ GOVCMS_VERSION }}/$GOVCMS_VERSION/" .version.yml && rm .version.yml.bak
sed -i.bak "s/{{ GOVCMS_VERSION }}/$GOVCMS_VERSION/" docker-compose.yml && rm docker-compose.yml.bak
sed -i.bak "s/{{ GOVCMS_VERSION }}/$GOVCMS_VERSION/" .env && rm .env.bak
sed -i.bak "s/{{ GOVCMS_VERSION }}/$GOVCMS_VERSION/" .docker/Dockerfile* && rm .docker/Dockerfile*.bak

if [[ "$GOVCMS_TYPE" != "paas" ]]; then
  cat >> .gitignore << 'EOF'
# Added by the scaffold provisioner.
web/
scripts/
drush/
EOF
else
  ## Remove SaaS-only blocks from .lagoon.yml
  sed -i.bak "/START SaaS-only/,/END SaaS-only/d" .lagoon.yml && rm .lagoon.yml.bak
fi

# Remove non-relevant scaffold items
echo "[info]: Cleaning up"

if [[ "$GOVCMS_TYPE" == "paas" ]]; then
  rm .docker/Dockerfile*saas*
else
  rm .docker/Dockerfile*paas*
  rm -r .docker/config/solr
fi


# trap finish EXIT
