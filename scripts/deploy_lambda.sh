#!/usr/bin/env bash
#
# deploy_lambda.sh
#
# Deploy (update) an existing AWS Lambda function's code from an Nx monorepo,
# with optional Nx build steps and a splash of ASCII art/color. Fails if the
# Lambda doesn't already exist. Assumes AWS CLI is already authenticated/configured.

set -euo pipefail

TIME_NOW="$(TZ=America/New_York date +'%Y-%m-%d %H:%M:%S %Z')"
echo "Script run time (EST): $TIME_NOW"
echo "Current working directory: $(pwd)"

###############################################################################
#                            ANSI COLOR CONSTANTS
###############################################################################
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
BOLD='\033[1m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color
BLUE='\033[0;34m'

###############################################################################
#                              ASCII ART HEADER
###############################################################################
# We'll echo the ASCII art in yellow, then append the rocketship line.


echo -e "${BLUE}"
cat << "EOF"

 _                     _         _         _ _ _           _              
| |                   | |       | |       |  _  \         | |            
| |     __ _ _ __ ___ | |__   __| | __ _  | | | |___ _ __ | | ___  _   _ 
| |    / _` | '_ ` _ \| '_ \ / _` |/ _` | | | | / _ \ '_ \| |/ _ \| | | |
| |___| (_| | | | | | | |_) | (_| | (_| | | |/ /  __/ |_) | | (_) | |_| |
\_____/\__,_|_| |_| |_|_.__/ \__,_|\__,_| |___/ \___| .__/|_|\___/ \__, |
                                                    | |             __/ |
                                                    |_|            |___/    

EOF
echo -e "            🚀 A fun script for Nx builds & AWS Lambda updates${NC}\n"


###############################################################################
#                           LOG LEVEL & HELPER
###############################################################################
LOG_LEVEL=1  # (0 = silent, 1 = normal, 2 = verbose, 3 = obnoxious)

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
#                    DEFAULT CONFIG & SCRIPT USAGE
###############################################################################
RUNTIME="nodejs18.x"
DO_BUILD=false
NX_PROJECT_NAME=""
USAGE="
${BOLD}Usage:${NC} $0 --lambda-name <STRING> --handler-file <FILE> --role-arn <ARN> [OPTIONS]

Example:
  $0 --lambda-name myLambda \\
     --handler-file dist/apps/my-lambda/index.js \\
     --role-arn arn:aws:iam::123456789012:role/myLambdaRole \\
     --nx-project my-lambda \\
     --build \\
     --verbose

${BOLD}Options:${NC}
  --lambda-name <STRING>    The existing Lambda function name (required)
  --handler-file <FILE>     Output handler file after Nx build (e.g. dist/apps/my-lambda/index.js)
  --role-arn <ARN>          IAM role ARN for Lambda (required, but not used here if just updating code)
  --runtime <STRING>        Lambda runtime (default: ${RUNTIME})
  --nx-project <STRING>     Nx project name (if using --build)
  --build                   Run 'yarn nx build' before deploying
  --silent                  Minimal output
  --verbose                 More detailed output
  --obnoxious               Maximum output
  -h, --help                Show this help message and exit
"

###############################################################################
#                          PARSE CLI ARGUMENTS
###############################################################################
LAMBDA_NAME=""
HANDLER_FILE=""
ROLE_ARN=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --lambda-name)
      LAMBDA_NAME="$2"
      shift 2
      ;;
    --handler-file)
      HANDLER_FILE="$2"
      shift 2
      ;;
    --role-arn)
      ROLE_ARN="$2"
      shift 2
      ;;
    --runtime)
      RUNTIME="$2"
      shift 2
      ;;
    --nx-project)
      NX_PROJECT_NAME="$2"
      shift 2
      ;;
    --build)
      DO_BUILD=true
      shift 1
      ;;
    --silent)
      LOG_LEVEL=0
      shift 1
      ;;
    --verbose)
      LOG_LEVEL=2
      shift 1
      ;;
    --obnoxious)
      LOG_LEVEL=3
      shift 1
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

if [[ -z "$LAMBDA_NAME" || -z "$HANDLER_FILE" || -z "$ROLE_ARN" ]]; then
  echo -e "${RED}ERROR:${NC} --lambda-name, --handler-file, and --role-arn are required."
  echo -e "$USAGE"
  exit 1
fi

###############################################################################
#                           NX BUILD (OPTIONAL)
###############################################################################
if $DO_BUILD; then
  if [[ -z "$NX_PROJECT_NAME" ]]; then
    echo -e "${RED}ERROR:${NC} --nx-project must be specified if --build is used."
    exit 1
  fi

  log "🔨  Building Nx project '${NX_PROJECT_NAME}'..." 1 "$BLUE"

  if [ $LOG_LEVEL -ge 3 ]; then
    # Obnoxious logs
    yarn nx build "$NX_PROJECT_NAME"
  elif [ $LOG_LEVEL -ge 2 ]; then
    # Verbose logs
    yarn nx build "$NX_PROJECT_NAME"
  else
    # Silent/normal
    yarn nx build "$NX_PROJECT_NAME" > /dev/null
  fi

  log "✅  Nx build complete." 1 "$GREEN"
fi

###############################################################################
#                   PREPARE ZIP PACKAGE FOR LAMBDA
###############################################################################
TMP_DIR="./tmp_lambda_${LAMBDA_NAME}"
ZIP_FILE="${LAMBDA_NAME}.zip"

rm -rf "$TMP_DIR"
mkdir -p "$TMP_DIR"

log "📦  Copying handler file to temporary directory..." 2 "$CYAN"
cp "$HANDLER_FILE" "$TMP_DIR/"

log "🎁  Zipping Lambda code into ${ZIP_FILE}..." 1 "$CYAN"
rm -f "$ZIP_FILE"
(
  cd "$TMP_DIR"
  zip -rq "../$ZIP_FILE" .
)

log "🎉  Archive created: ${ZIP_FILE}" 1 "$GREEN"

###############################################################################
#                  CHECK IF LAMBDA EXISTS (DON'T CREATE)
###############################################################################
log "🔎  Checking if Lambda '${LAMBDA_NAME}' exists..." 1 "$YELLOW"
EXISTS=$(aws lambda get-function --function-name "$LAMBDA_NAME" 2>/dev/null || true)

if [ -z "$EXISTS" ]; then
  echo -e "${RED}ERROR:${NC} Lambda function '${LAMBDA_NAME}' does not exist. Aborting."
  rm -rf "$TMP_DIR" "$ZIP_FILE"
  exit 1
fi

log "✅  Lambda '${LAMBDA_NAME}' found. Proceeding with update..." 1 "$GREEN"

###############################################################################
#                        UPDATE LAMBDA FUNCTION CODE
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
