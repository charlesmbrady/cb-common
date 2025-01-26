#!/usr/bin/env bash
#
# deploy_lambda.sh
#
# Simplified script to build and deploy an existing AWS Lambda function from an Nx monorepo.

set -euo pipefail

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
echo -e "🚀  Building and deploying Lambda function using Nx${NC}\n"

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

  if [ "$LOG_LEVEL" -ge "$level" ]; then
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

  if [ "$LOG_LEVEL" -ge 3 ]; then
    yarn nx build "$NX_PROJECT_NAME" --verbose
  elif [ "$LOG_LEVEL" -ge 2 ]; then
    yarn nx build "$NX_PROJECT_NAME" --verbose
  else
    yarn nx build "$NX_PROJECT_NAME" > /dev/null
  fi

  log "✅  Nx build complete." 1 "$GREEN"
fi

###############################################################################
#        COPY BUILD TO TEMP FOLDER AND INSTALL DEPENDENCIES
###############################################################################
if [ ! -d "$DIST_DIR" ]; then
  echo -e "${RED}ERROR:${NC} Missing build output folder '${DIST_DIR}'. Maybe build failed."
  exit 1
fi

log "📂  Copying build output to '${TMP_DIR}'..." 1 "$CYAN"
rm -rf "$TMP_DIR"
mkdir -p "$TMP_DIR"

cp -R "${DIST_DIR}/." "$TMP_DIR/"

log "📦  Installing production dependencies in '${TMP_DIR}'..." 1 "$CYAN"
(
  cd "$TMP_DIR"
  # Ensure package.json exists
  if [ ! -f package.json ]; then
    echo -e "${RED}ERROR:${NC} Missing package.json in '${DIST_DIR}'."
    exit 1
  fi

  # Install only production dependencies
  yarn install --production > /dev/null
)

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
#                     UPDATE LAMBDA FUNCTION CODE
###############################################################################
log "🚀  Updating Lambda function '${LAMBDA_NAME}'..." 1 "$BLUE"

if [ "$LOG_LEVEL" -ge 3 ]; then
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
