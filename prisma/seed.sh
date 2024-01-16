#!/bin/zsh

# -e Exit immediately when a command returns a non-zero status.
# -x Print commands before they are executed

set -ex
# Seeding command
psql $DB_CONNECTION_STRING -f ./prisma/seed-data.sql