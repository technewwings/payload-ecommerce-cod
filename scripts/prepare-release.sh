#!/bin/bash

# Script to prepare a new release
# Usage: ./scripts/prepare-release.sh [patch|minor|major|version]

set -e

RELEASE_TYPE=${1:-patch}

echo "Preparing release: $RELEASE_TYPE"

# Ensure we're on main branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ]; then
  echo "Error: You must be on the main branch to create a release"
  exit 1
fi

# Ensure working directory is clean
if [ -n "$(git status --porcelain)" ]; then
  echo "Error: Working directory is not clean. Please commit or stash changes."
  exit 1
fi

# Pull latest changes
echo "Pulling latest changes..."
git pull origin main

# Run tests
echo "Running tests..."
npm test

# Run build
echo "Building package..."
npm run build

# Bump version
echo "Bumping version..."
npm version $RELEASE_TYPE -m "chore: release v%s"

NEW_VERSION=$(node -p "require('./package.json').version")

echo ""
echo "✅ Release v$NEW_VERSION prepared successfully!"
echo ""
echo "Next steps:"
echo "1. Review the changes and update CHANGELOG.md if needed"
echo "2. Push the changes and tag:"
echo "   git push origin main --follow-tags"
echo "3. The GitHub Action will automatically publish to npm"
echo ""
