#!/bin/bash

# Script to publish the build artifacts to a GitHub repository.
# Builds will be automatically published once new changes are made to the repository.

# The script should immediately exit if any command in the script fails.
set -e

# Go to the project root directory
cd $(dirname ${0})/../..

if [ -z ${NGX_GROUNDHOG_BUILD_TOKEN} ]; then
  echo "Error: No access token for GitHub could be found." \
       "Please set the environment variable 'NGX_GROUNDHOG_BUILD_TOKEN'."
  exit 1
fi

# ngx-groundhog packages that need to published.
PACKAGES=(ngx-groundhog)
REPOSITORIES=(ngx-groundhog-builds)

# Command line arguments.
COMMAND_ARGS=${*}

commitSha=$(git rev-parse --short HEAD)

# Function to publish artifacts of a package to Github.
#   @param ${1} Name of the package
#   @param ${2} Repository name of the package.
publishPackage() {
  packageName=${1}
  packageRepo=${2}
  commitSha=${3}
  buildDir="dist/releases/${packageName}"
  buildVersion=$(node -pe "require('./package.json').version")

  commitAuthorName=$(git --no-pager show -s --format='%an' HEAD)
  commitAuthorEmail=$(git --no-pager show -s --format='%ae' HEAD)
  commitMessage=$(git log --oneline -n 1)
  commitTag="${buildVersion}-${commitSha}"

  repoUrl="https://github.com/Dynatrace/${packageRepo}.git"
  repoDir="tmp/${packageRepo}"

  echo "Starting publish process of ${packageName} for ${commitTag}.."

  if [[ ! ${COMMAND_ARGS} == *--no-build* ]]; then
    # Create a release of the current repository.
    $(npm bin)/gulp ${packageName}:build-release:clean
  fi

  # Prepare cloning the builds repository
  rm -rf ${repoDir}
  mkdir -p ${repoDir}

  echo "Starting cloning process of ${repoUrl} into ${repoDir}.."

  # Clone the repository and only fetch the last commit to download less unused data.
  git clone ${repoUrl} ${repoDir} --depth 1

  echo "Successfully cloned ${repoUrl} into ${repoDir}."

  # Copy the build files to the repository
  rm -rf ${repoDir}/*
  cp -r ${buildDir}/* ${repoDir}

  echo "Removed everything from ${packageRepo} and added the new build output."

  # Create the build commit and push the changes to the repository.
  cd ${repoDir}

  echo "Switched into the repository directory (${repoDir})."

  if [[ $(git ls-remote origin "refs/tags/${commitTag}") ]]; then
    echo "Skipping publish because tag is already published"
    exit 0
  fi

  # Replace the version in every file recursively with a more specific version that also includes
  # the SHA of the current build job. Normally this "sed" call would just replace the version
  # placeholder, but the version placeholders have been replaced by the release task already.
  sed -i "s/${buildVersion}/${commitTag}/g" $(find . -type f -not -path '*\/.*')

  echo "Updated the build version in every file to include the SHA of the latest commit."

  # Prepare Git for pushing the artifacts to the repository.
  git config user.name "${commitAuthorName}"
  git config user.email "${commitAuthorEmail}"
  git config credential.helper "store --file=.git/credentials"

  echo "https://${NGX_GROUNDHOG_BUILD_TOKEN}:@github.com" > .git/credentials

  echo "Git configuration has been updated to match the last commit author. Publishing now.."

  git add -A
  git commit --allow-empty -m "${commitMessage}"
  git tag "${commitTag}"
  git push origin master --tags

  echo "Published package artifacts for ${packageName}#${commitSha}."
}

# Publish artifacts of the current package. Run publishing in a sub-shell to avoid working
# directory changes.
(publishPackage ngx-groundhog ngx-groundhog-builds ${commitSha})
code=$?

if [[ ${code} == 0 ]]; then
  commitShaLong=$(git rev-parse HEAD)
  if [[ $(git describe --tags --exact-match ${commitShaLong}) ]]; then
    tag=$(git describe --tags --exact-match ${commitShaLong})
  else
    tag=""
  fi
  # Publish to npm
  if [[ ${tag} =~ ^release-v([0-9]+\.){2}[0-9]+(-[a-z]+)? ]]; then
    echo "Tag found for ${commitShaLong}: ${tag}"
    ./scripts/deploy/npm-publish.sh
  fi
fi

