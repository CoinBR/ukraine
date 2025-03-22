#!/bin/sh

DIR="$(dirname "$0")"
. "$DIR/submodules/megaman/megaman.sh"

default_action() {
  ${ENVIRONMENT}
}

setup() {
  echo "Navigating to root directory..."
  cd "$DIR"

  echo "Loading environment variables..."
  . ./.env

  kill_port $UI_PORT $API_PORT

  create_missing_config_files_from_sample

  try_copy_to_child_project ui submodules
  try_copy_to_child_project ui .env

  try_copy_to_child_project api submodules
  try_copy_to_child_project api .env
  try_copy_to_child_project api services.yml

  echo "-- finished root run.sh setup"
}

dev() {
  api/run.sh dev &
  ui/run.sh dev &
}

prod() {
  docker_compose down
  docker_compose build
  docker_compose up
}

setup
run_args "$@"
