#!/bin/bash

set -e

echo "Starting the release process..."
echo "Provided options: $@"

echo "Publishing 'react-native-nai-timer' to NPM"
cd packages/react-native-nai-timer
bun release $@

echo "Creating a Git bump commit and GitHub release"
cd ../..
bun run release-it $@

echo "Successfully released Nai Timer!"
