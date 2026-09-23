#!/bin/bash
set -e

# Get the lando logger
. /helpers/log.sh

# Run the command.
bash -c "$*"
