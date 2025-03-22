#!/bin/sh

DIR="$(dirname "$0")"
. $DIR/submodules/megaman/megaman.sh

default_action() {
  ${ENVIRONMENT}
}

setup() {
  . ./.env
  cd "$DIR"
}

dev() {
  kill_port $API_PORT

  echo "Installing dependencies..."
  npm i

  echo "Starting API in development mode..."
  npm run dev
}

prod() {
  echo "Starting API in production mode..."
  npm run start
}

setup
run_args "$@"
