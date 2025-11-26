#!/usr/bin/env bash

# Minimal Nx S3 Deploy Script
# Usage: ./deploy_app.sh --project-name <PROJECT_NAME> --bucket-name <S3_BUCKET> [--configuration <test|production>]

set -e

PROJECT_NAME=""
S3_BUCKET=""
CONFIGURATION="production"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --project-name)
      PROJECT_NAME="$2"
      shift 2
      ;;
    --bucket-name)
      S3_BUCKET="$2"
      shift 2
      ;;
    --configuration)
      CONFIGURATION="$2"
      shift 2
      ;;
    *)
      shift
      ;;
  esac
done

if [[ -z "$PROJECT_NAME" || -z "$S3_BUCKET" ]]; then
  echo "Usage: $0 --project-name <PROJECT_NAME> --bucket-name <S3_BUCKET> [--configuration <test|production>]"
  exit 1
fi

echo "Building $PROJECT_NAME with configuration: $CONFIGURATION"
yarn nx build "$PROJECT_NAME" --configuration="$CONFIGURATION"

OUT_DIR="dist/apps/$PROJECT_NAME"

if [[ ! -d "$OUT_DIR" ]]; then
  echo "Build output directory $OUT_DIR does not exist."
  exit 1
fi

echo "Syncing $OUT_DIR to s3://$S3_BUCKET/ ..."
aws s3 sync "$OUT_DIR" "s3://$S3_BUCKET/" --delete

echo "Deploy complete!"
