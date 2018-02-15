#!/bin/bash

# Script to publish to npm.

# The script should immediately exit if any command in the script fails.
set -e

echo "Starting npm publish"

repoUrl="https://github.com/Dynatrace/ngx-groundhog-builds.git"
repoDir="tmp/ngx-groundhog-builds"

echo "Starting publish process of ngx-groundhog-builds"

# Prepare cloning the builds repository
rm -rf ${repoDir}
mkdir -p ${repoDir}

echo "Starting cloning process of ${repoUrl} into ${repoDir}.."

commitSha=$(git rev-parse --short HEAD)
buildVersion=$(node -pe "require('./package.json').version")
commitTag="${buildVersion}-${commitSha}"

# Clone the repository and only fetch the last commit to download less unused data.
git clone ${repoUrl} ${repoDir} --depth 1

# Changes to the repository.
cd ${repoDir}

# Checkout specific release tag
git fetch --tags
git checkout tags/${commitTag}

echo "Successfully cloned ${repoUrl} into ${repoDir} and checked out ${commitTag}"

npm set init.author.name "${NPM_AUTHOR}"
npm set init.author.email "${NPM_AUTHOR_EMAIL}"
echo "//registry.npmjs.org/:_authToken=${NPM_AUTH_TOKEN}" > ~/.npmrc

npm publish

echo "npm publish done"