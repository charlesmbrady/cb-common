#!/usr/bin/env bash
#
# deploy_lambda.sh
#
# Deploy (update) an existing AWS Lambda function's code from an Nx monorepo,
# with optional Nx build steps. Copies the compiled Nest.js output (including
# node_modules) so the Lambda has all dependencies at runtime. Assumes AWS CLI
# is already authenticated/configured and the Lambda function already exists.

set -euo pipefail

###############################################################################
#                           CHANGE TO MONOREPO ROOT
###############################################################################
# Ensure the script runs from the monorepo root directory
cd "$(dirname "$0")/.."

###############################################################################
#                              ASCII ART HEADER
###############################################################################
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}"
cat << "EOF"
/////////////////////////////////////////////////////////////////////////////////
//     _                     _         _         _ _ _           _              
//    | |                   | |       | |       |  _  \         | |            
//    | |     __ _ _ __ ___ | |__   __| | __ _  | | | |___ _ __ | | ___  _   _ 
//    | |    / _` | '_ ` _ \| '_ \ / _` |/ _` | | | | / _ \ '_ \| |/ _ \| | | |
//    | |___| (_| | | | | | | |_) | (_| | (_| | | |/ /  __/ |_) | | (_) | |_| |
//    \_____/\__,_|_| |_| |_|_.__/ \__,_|\__,_| |___/ \___| .__/|_|\___/ \__, |
//                                                        | |             __/ |
//                                                        |_|            |___/    
///////////////////////////////////////////////////////////////////////////////

EOF
echo -e "🚀  A fun script for Nx builds & AWS Lambda updates${NC}\n"

###############################################################################
#                            ANSI COLOR CONSTANTS
###############################################################################
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
BOLD='\033[1m'

LOG_LEVEL=1  # (0 = silent, 1 = normal, 2 = verbose, 3 = obnoxious)

###############################################################################
#                           HELPER LOG FUNCTION
###############################################################################
log() {
  # Usage: log <message> <level> <color>
  local message="$1"
  local level="${2:-1}"
  local color="${3:-$NC}"

  if [ $LOG_LEVEL -ge $level ]; then
    echo -e "${color}${message}${NC}"
  fi
}

###############################################################################
#                          DEFAULT CONFIG & USAGE
###############################################################################
RUNTIME="nodejs20.x"
DO_BUILD=false
NX_PROJECT_NAME=""

USAGE="
${BOLD}Usage:${NC} $0 --lambda-name <STRING> --nx-project <STRING> [OPTIONS]

Example:
  $0 --lambda-name myLambda \\
     --nx-project services-middleware \\
     --build \\
     --verbose

${BOLD}Options:${NC}
  --lambda-name <STRING>    The existing Lambda function name (required)
  --nx-project <STRING>     Nx project name (required for copying build output)
  --build                   Run 'yarn nx build' before zipping
  --runtime <STRING>        Lambda runtime if needed (default: ${RUNTIME})
  --silent                  Minimal output
  --verbose                 More detailed output
  --obnoxious               Maximum output
  -h, --help                Show this help message and exit
"

###############################################################################
#                        PARSE CLI ARGUMENTS
###############################################################################
LAMBDA_NAME=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --lambda-name)
      LAMBDA_NAME="$2"
      shift 2
      ;;
    --nx-project)
      NX_PROJECT_NAME="$2"
      shift 2
      ;;
    --build)
      DO_BUILD=true
      shift
      ;;
    --runtime)
      RUNTIME="$2"
      shift 2
      ;;
    --silent)
      LOG_LEVEL=0
      shift
      ;;
    --verbose)
      LOG_LEVEL=2
      shift
      ;;
    --obnoxious)
      LOG_LEVEL=3
      shift
      ;;
    -h|--help)
      echo -e "$USAGE"
      exit 0
      ;;
    *)
      echo -e "${RED}Unknown option:${NC} $1"
      echo -e "$USAGE"
      exit 1
      ;;
  esac
done

if [[ -z "$LAMBDA_NAME" || -z "$NX_PROJECT_NAME" ]]; then
  echo -e "${RED}ERROR:${NC} --lambda-name and --nx-project are required."
  echo -e "$USAGE"
  exit 1
fi

###############################################################################
#                              TIMESTAMP
###############################################################################
TIMESTAMP=$(TZ='America/New_York' date '+%Y-%m-%d %H:%M:%S %Z')
echo -e "${YELLOW}Deployment started at: ${TIMESTAMP}${NC}\n"

DIST_DIR="dist/apps/${NX_PROJECT_NAME}"
TMP_DIR="./tmp_lambda_${LAMBDA_NAME}"
ZIP_FILE="${LAMBDA_NAME}.zip"

###############################################################################
#                       OPTIONAL NX BUILD STEP
###############################################################################
if $DO_BUILD; then
  log "🔨  Building Nx project '${NX_PROJECT_NAME}'..." 1 "$BLUE"

  if [ $LOG_LEVEL -ge 3 ]; then
    yarn nx build "$NX_PROJECT_NAME"
  elif [ $LOG_LEVEL -ge 2 ]; then
    yarn nx build "$NX_PROJECT_NAME" --verbose
  else
    yarn nx build "$NX_PROJECT_NAME" > /dev/null
  fi

  log "✅  Nx build complete." 1 "$GREEN"
fi

###############################################################################
#        INSTALL PRODUCTION DEPENDENCIES & COPY BUILD TO TEMP FOLDER
###############################################################################
if [ ! -d "$DIST_DIR" ]; then
  echo -e "${RED}ERROR:${NC} Missing build output folder '${DIST_DIR}'. Maybe build failed."
  exit 1
fi

log "📦  Installing production dependencies in '${DIST_DIR}'..." 1 "$CYAN"
(
  cd "$DIST_DIR"
  # Ensure package.json exists
  if [ ! -f package.json ]; then
    echo -e "${RED}ERROR:${NC} Missing package.json in '${DIST_DIR}'."
    exit 1
  fi

  # Install only production dependencies
  yarn install --production || {
    echo -e "${RED}ERROR:${NC} Yarn install (production) failed"
    exit 1
  }
)

rm -rf "$TMP_DIR"
mkdir -p "$TMP_DIR"

log "📂  Copying build output to '${TMP_DIR}'..." 1 "$CYAN"
cp -R "${DIST_DIR}/." "$TMP_DIR/"

###############################################################################
#                     CREATE ZIP PACKAGE FOR LAMBDA
###############################################################################
log "🎁  Zipping Lambda code into ${ZIP_FILE}..." 1 "$CYAN"
rm -f "$ZIP_FILE"
(
  cd "$TMP_DIR"
  zip -rq "../$ZIP_FILE" .
)

log "🎉  Archive created: ${ZIP_FILE}" 1 "$GREEN"

###############################################################################
#            CHECK IF LAMBDA EXISTS (NO CREATION IF MISSING)
###############################################################################
log "🔎  Checking if Lambda '${LAMBDA_NAME}' exists..." 1 "$YELLOW"
EXISTS=$(aws lambda get-function --function-name "$LAMBDA_NAME" 2>/dev/null || true)

if [ -z "$EXISTS" ]; then
  echo -e "${RED}ERROR:${NC} Lambda function '${LAMBDA_NAME}' does not exist. Aborting."
  rm -rf "$TMP_DIR" "$ZIP_FILE"
  exit 1
fi

log "✅  Lambda '${LAMBDA_NAME}' found. Proceeding with code update..." 1 "$GREEN"

###############################################################################
#                     VERIFY HANDLER EXPORT & DEPENDENCIES
###############################################################################
log "🔍  Verifying handler export and dependencies..." 2 "$MAGENTA"

# Function to check if handler is exported correctly
check_handler_export() {
  local handler_file="$1"
  local handler_name="$2"

  if ! node -e "const handler = require('./$handler_file'); if (typeof handler.$handler_name !== 'function') { process.exit(1); }" ; then
    echo -e "${RED}ERROR:${NC} Handler '${handler_name}' is not exported correctly in '${handler_file}'."
    exit 1
  fi
}

# Function to check if a specific module exists in node_modules
check_dependency_exists() {
  local module="$1"

  if [ ! -d "node_modules/$module" ]; then
    echo -e "${RED}ERROR:${NC} Dependency '${module}' is missing in node_modules."
    exit 1
  fi
}

# Navigate to temp directory to perform checks
(
  cd "$TMP_DIR"

  # Replace 'main.js' and 'handler' with your actual handler file and function name
  HANDLER_FILE="main.js"
  HANDLER_NAME="handler"

  # Check if handler file exists
  if [ ! -f "$HANDLER_FILE" ]; then
    echo -e "${RED}ERROR:${NC} Handler file '${HANDLER_FILE}' not found in the deployment package."
    exit 1
  fi

  # Check if handler is exported correctly
  check_handler_export "$HANDLER_FILE" "$HANDLER_NAME"

  # List of essential dependencies to verify (add more as needed)
  DEPENDENCIES=(
    "@nestjs/common"
    "@nestjs/core"
    "@vendia/serverless-express"
    "express"
    # Add other critical dependencies here
  )

  for dep in "${DEPENDENCIES[@]}"; do
    check_dependency_exists "$dep"
  done

  log "✅  Handler export and dependencies are verified." 2 "$MAGENTA"
)

###############################################################################
#                     UPDATE LAMBDA FUNCTION CODE
###############################################################################
log "🚀  Updating Lambda code for '${LAMBDA_NAME}'..." 1 "$BLUE"

if [ $LOG_LEVEL -ge 3 ]; then
  # Obnoxious (full AWS CLI output)
  aws lambda update-function-code \
    --function-name "$LAMBDA_NAME" \
    --zip-file "fileb://${ZIP_FILE}" \
    --publish
else
  # Normal or silent
  aws lambda update-function-code \
    --function-name "$LAMBDA_NAME" \
    --zip-file "fileb://${ZIP_FILE}" \
    --publish > /dev/null
fi

log "✅  Lambda function '${LAMBDA_NAME}' updated successfully." 1 "$GREEN"

###############################################################################
#                                 CLEANUP
###############################################################################
rm -rf "$TMP_DIR" "$ZIP_FILE"
log "💡  Deployment script complete." 1 "$MAGENTA"
exit 0
