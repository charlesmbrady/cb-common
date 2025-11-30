#!/usr/bin/env bash
set -euo pipefail

# -----------------------------------------------------------------------------
# Deploy API Services to AWS Lambda (force clean rebuild)
# -----------------------------------------------------------------------------
# Usage:
#   ./scripts/deploy_lambda.sh --env test --nx-project-name api-services --lambda-name charlesmbrady_api_services_Test
# -----------------------------------------------------------------------------

# Defaults
ENV=""
NX_PROJECT_NAME=""
LAMBDA_NAME=""
WORKSPACE_DIR=$(cd "$(dirname "$0")"/.. && pwd)
TMP_PACKAGE_DIR=""
ZIP_PATH=""

print_usage() {
  echo "Usage: $0 --env <test|production> --nx-project-name <name> --lambda-name <aws_lambda_name>"
}

# Parse args
while [[ $# -gt 0 ]]; do
  case "$1" in
    --env)
      ENV="$2"; shift 2 ;;
    --nx-project-name)
      NX_PROJECT_NAME="$2"; shift 2 ;;
    --lambda-name)
      LAMBDA_NAME="$2"; shift 2 ;;
    -h|--help)
      print_usage; exit 0 ;;
    *)
      echo "Unknown argument: $1"; print_usage; exit 1 ;;
  esac
done

if [[ -z "$ENV" || -z "$NX_PROJECT_NAME" || -z "$LAMBDA_NAME" ]]; then
  echo "Missing required arguments."; print_usage; exit 1
fi

# Validate tools
command -v yarn >/dev/null 2>&1 || { echo "yarn not found"; exit 1; }
command -v aws >/dev/null 2>&1 || { echo "aws CLI not found"; exit 1; }
command -v zip >/dev/null 2>&1 || { echo "zip not found"; exit 1; }

# Resolve temp package dir name to match existing convention
TMP_PACKAGE_DIR="$WORKSPACE_DIR/tmp_lambda_${LAMBDA_NAME}"
ZIP_PATH="$TMP_PACKAGE_DIR.zip"

# Colors
BRIGHT_YELLOW="\x1b[1m\x1b[33m"
RESET_COLOR="\x1b[0m"

echo "${BRIGHT_YELLOW}🚀 Deploying '$NX_PROJECT_NAME' to Lambda '$LAMBDA_NAME' (${ENV})${RESET_COLOR}"

# Clean previous temp packaging
if [[ -d "$TMP_PACKAGE_DIR" ]]; then
  echo "Cleaning previous temp directory: $TMP_PACKAGE_DIR"
  rm -rf "$TMP_PACKAGE_DIR"
fi
mkdir -p "$TMP_PACKAGE_DIR"

# Install deps (no modification to lockfile)
pushd "$WORKSPACE_DIR" >/dev/null
  echo "Installing workspace dependencies (if needed)..."
  YARN_VERSION=$(yarn -v || echo "1")
  if [[ ${YARN_VERSION%%.*} -ge 2 ]]; then
    yarn install --frozen-lockfile
  else
    # Yarn Classic (v1) does not support --frozen-lockfile reliably; avoid strict lock
    yarn install
  fi

  # Bundle the Lambda entry using esbuild into CommonJS at path expected by handler
  # AWS console shows handler = api-services/main.handler, so output to api-services/main.js
  echo "Bundling Lambda with esbuild (yarn)..."
  mkdir -p "$TMP_PACKAGE_DIR/api-services"
  if yarn esbuild --version >/dev/null 2>&1; then
    yarn esbuild "$WORKSPACE_DIR/apps/$NX_PROJECT_NAME/src/main.ts" \
      --bundle --platform=node --target=node20 --format=cjs \
      --outfile="$TMP_PACKAGE_DIR/api-services/main.js"
  else
    echo "esbuild is not available via yarn. Please ensure 'esbuild' is in devDependencies and installed." >&2
    exit 1
  fi

  # Create a minimal package.json to satisfy Lambda Node runtime (CommonJS)
  cat > "$TMP_PACKAGE_DIR/package.json" << 'JSON'
{
  "name": "cb-common-api-services-lambda",
  "version": "0.0.0",
  "private": true,
  "type": "commonjs",
  "main": "api-services/main.js"
}
JSON

  # No node_modules needed: esbuild bundle contains dependencies

  # Create zip next to temp dir for AWS CLI
  echo "Creating deployment zip: $ZIP_PATH"
  rm -f "$ZIP_PATH"
  (cd "$TMP_PACKAGE_DIR" && zip -qr "$ZIP_PATH" .)
popd >/dev/null

# Upload to AWS Lambda
echo "Updating AWS Lambda function code: $LAMBDA_NAME"
aws lambda update-function-code \
  --function-name "$LAMBDA_NAME" \
  --zip-file "fileb://$ZIP_PATH" >/dev/null

echo "${BRIGHT_YELLOW}✅ Deployment complete. Lambda updated: $LAMBDA_NAME${RESET_COLOR}"
