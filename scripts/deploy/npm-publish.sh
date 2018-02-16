#!/bin/bash

# Script to publish to npm.

# The script should immediately exit if any command in the script fails.
set -e

echo "Starting npm publish"

releaseDir="dist/releases/ngx-groundhog"

# Copy readme md to release to have it on npm
cp ./README.md ${releaseDir}

# Changes to the repository.
cd ${releaseDir}

npm set init.author.name "${NPM_AUTHOR}"
npm set init.author.email "${NPM_AUTHOR_EMAIL}"
echo "//registry.npmjs.org/:_authToken=${NPM_AUTH_TOKEN}" > ~/.npmrc

npm publish --access=public

echo "npm publish done"