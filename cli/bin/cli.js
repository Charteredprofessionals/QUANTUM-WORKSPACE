#!/bin/sh
# AI Dev Suite CLI Entry Point

# Get the directory of this script
DIR="$(cd "$(dirname "$0")" && pwd)"

# Check if Node.js is available
if ! command -v node > /dev/null 2>&1; then
  echo "Error: Node.js is not installed"
  echo "Please install Node.js from https://nodejs.org"
  exit 1
fi

# Run the CLI
exec node "$DIR/dist/index.js" "$@"