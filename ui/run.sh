#!/bin/sh

DIR="$(dirname "$0")"
. $DIR/submodules/megaman/megaman.sh

default_action() {
  ${ENVIRONMENT}
}

setup() {
  cd "$DIR"
  . ./.env
}

dev() {
  kill_port $UI_PORT

  echo "Installing dependencies..."
  npm i

  echo "Starting UI in development mode..."
  npm run dev
}

prod() {
  echo "Starting UI in production mode..."
  npx serve dist -l $UI_PORT
}

setup
run_args "$@"

