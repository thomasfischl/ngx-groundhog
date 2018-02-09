#!/bin/bash

# Script that runs in the testing build stage of Travis and is responsible for testing
# the project in different Travis jobs of the current build stage.

# The script should immediately exit if any command in the script fails.
set -e

echo ""
echo "Building sources and running tests. Running mode: ${MODE}"
echo ""

# Go to project dir
cd $(dirname $0)/..

# Include sources.
source scripts/mode.sh

# Get commit diff
fileDiff=$(git diff --name-only $TRAVIS_BRANCH...HEAD)

# Check if tests can be skipped
if [[ ${fileDiff} =~ ^(.*\.md\s*)*$ ]]; then
  echo "Skipping tests since only markdown files changed."
  exit 0
fi

if is_lint; then
  $(npm bin)/gulp lint
elif is_e2e; then
  $(npm bin)/gulp e2e
elif is_unit; then
  $(npm bin)/gulp test:single-run
elif is_universal; then
  $(npm bin)/gulp universal
fi