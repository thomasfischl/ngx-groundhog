#!/bin/bash

# Script that runs in the deploy stage after the testing stage of Travis passed.
# Build artifacts and docs content will be published to different repositories.

# The script should immediately exit if any command in the script fails.
set -e

# Go to the project root directory
cd $(dirname $0)/..

# If the current Travis job is triggered by a pull request skip the deployment.
# This check is necessary because Travis still tries to run the deploy build-stage for
# pull requests.
if [[ "$TRAVIS_PULL_REQUEST" != "false" ]]; then
  echo "Build artifacts will only be deployed in Travis push builds."
  exit 0;
fi

echo ""
echo "Starting the deployment script. Running mode: ${DEPLOY_MODE}"
echo ""

# Deployment of the build artifacts and docs-content should only happen on a per-commit base.
# The target is to provide build artifacts in the GitHub repository for every commit.
if [[ "${DEPLOY_MODE}" == "build-artifacts" ]]; then
  ./scripts/deploy/publish-build-artifacts.sh
fi

# Publish to npm
if [[ "${DEPLOY_MODE}" == "npm" ]]; then
  ./scripts/deploy/npm-publish.sh
fi