#!/bin/bash

APP_NAME=$1
FUNCTION_NAME=$2
EXTRA_FILES=$4

# allow overriding the aws account, default to member-profile-dev
export AWS_PROFILE=${3:-member-profile-dev}

echo "deploying $APP_NAME to $FUNCTION_NAME in $AWS_PROFILE account"

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

cd ./dist/apps

zip -r $APP_NAME.zip $APP_NAME/ $EXTRA_FILES
if [ $? -ne 0 ]; then
  echo "Failed to zip, exiting task"
  exit $?
fi

aws lambda update-function-code --function-name $FUNCTION_NAME --zip-file fileb://$APP_NAME.zip
if [ $? -ne 0 ]; then
  echo "Failed to update, exiting task"
  exit $?
fi