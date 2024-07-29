#!/usr/bin/env bash

#
# Modification script for the GovCMS Scaffold chnage varaibles in lando files.
#

echo "[info] Preparing Lando GovCMS Scaffold"

YELLOW='\033[0;33m'
NC='\033[0m' # No Color
printf "I ${RED}love${NC} Stack Overflow\n"

GOVCMS_NAME=$(grep -oP 'http://\K\w+' docker-compose.yml | head -n 1)
GOVCMS_VERSION=$(grep -oP 'GOVCMS_IMAGE_VERSION:-\K\w+' docker-compose.yml | head -n 1)
grep -q '^  solr:$' docker-compose.yml
HAS_SOLR=$?

if [[ -z "$GOVCMS_NAME" ]]; then
  echo "[error]: Cannot determine GovCMS project name."
  exit 2
fi

if [[ -z "$GOVCMS_VERSION" ]]; then
  echo "[error]: Cannot determine GovCMS version."
  exit 2
fi

echo "[info]: Modifying scaffold for GovCMS$GOVCMS_VERSION: $GOVCMS_NAME"

sed -i.bak "s/{{ GOVCMS_PROJECT_NAME }}/$GOVCMS_NAME/" .lando.base.yml && rm .lando.base.yml.bak
sed -i.bak "s/{{ GOVCMS_PROJECT_NAME }}/$GOVCMS_NAME/" .lando.local.example.yml && rm .lando.local.example.yml.bak
sed -i.bak "s/{{ GOVCMS_VERSION }}/$GOVCMS_VERSION/" .lando.base.yml && rm .lando.base.yml.bak
sed -i.bak "s/{{ GOVCMS_VERSION }}/$GOVCMS_VERSION/" .lando.local.example.yml && rm .lando.local.example.yml.bak

if [[ "$HAS_SOLR" -eq 0 ]]; then
  printf "${YELLOW}[!! action required !!]${NC}: SOLR has been detected,\n"
  printf "please uncomment the lando SOLR proxy and service in lando.base.yml\n"
  printf "and .lando.local[.example].yml files.\n"
fi

printf "${YELLOW}[!! action required !!]${NC}: For existing projects, you may\n"
printf "need to manually move the changes (new lines) added to the project\n"
printf "root's '.ahoy.yml' file to the 'custom/ahoy.yml' file instead as the file is\n"
printf "govcms locked, commands become 'ahoy my lando-[command]' instead.\n"

rm scripts/scaffold-post-setup-add-lando.sh

echo "[success]: Lando GovCMS scaffold changed!"
