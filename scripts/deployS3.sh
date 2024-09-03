#!/bin/bash

APP_NAME=$1
BUCKET_NAME=$2

# allow overriding the aws account, default to member-profile-dev
export AWS_PROFILE=${3:-member-profile-dev}

echo "deploying $APP_NAME to $BUCKET_NAME in $AWS_PROFILE account"

aws sso login
if [ $? -ne 0 ]; then
  echo "Failed to login, exiting task"
  exit $?
fi

yarn nx build $APP_NAME
if [ $? -ne 0 ]; then
  echo "Failed to build, exiting task"
  exit $?
fi

cd ./dist/apps/

aws s3 sync ${APP_NAME}/. s3://${BUCKET_NAME} --delete --exclude config.json
if [ $? -ne 0 ]; then
  echo "Failed to sync, exiting task"
  exit $?
fi