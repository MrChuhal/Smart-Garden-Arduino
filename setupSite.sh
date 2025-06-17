#!/usr/bin/env bash
set -e

# Download and install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# Load nvm without restarting the shell
# shellcheck disable=SC1090
\. "$HOME/.nvm/nvm.sh"

# Install and verify Node.js v22
nvm install 22
echo "Node.js version:"
node -v   # Should print "v22.16.0"
echo "Current nvm alias:"
nvm current  # Should print "v22.16.0"

# Verify npm version
echo "npm version:"
npm -v     # Should print "10.9.2"

# Install site dependencies
cd ./garden-site
npm install
echo "Garden-site dependencies installed."
