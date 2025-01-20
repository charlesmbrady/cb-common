#!/usr/bin/env bash
#
# sync_CMB_Root_TEST.sh
#
# Sync the out/ folder of an Nx workspace project to an S3 bucket.
# Adds multiple logging modes:
#   -v | --verbose   : More detailed logs
#   -q | --quiet     : Only minimal success message on completion
#   -s | --silent    : Absolutely no output except errors
#   -o | --obnoxious : Includes flashy ASCII art and color spam
#
# Usage:
#   ./sync_CMB_Root_TEST.sh [-v|-q|-s|-o] <PROJECT_NAME> <S3_BUCKET>
#
# Example:
#   ./sync_CMB_Root_TEST.sh -v charlesmbrady charlesmbrady-test-website-content
#
# The script:
#   1. Searches upward for nx.json and apps/ to find Nx root.
#   2. Verifies apps/<PROJECT_NAME>/out exists or warns user.
#   3. Excludes "portfolio/*" during aws s3 sync.
#   4. Provides interactive prompts for missing arguments, missing dirs, etc.

# ------------------------------------------------------------------------------
# Color Definitions
# ------------------------------------------------------------------------------
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# ------------------------------------------------------------------------------
# Logging Level Flags (default = normal)
# ------------------------------------------------------------------------------
VERBOSE=false
QUIET=false
SILENT=false
OBNOXIOUS=false

# ------------------------------------------------------------------------------
# Logging Functions
# ------------------------------------------------------------------------------
# We'll funnel all logs through these, checking flags before printing.

log_info() {
  # "Info" logs are shown unless we're in quiet or silent mode (or no log at all).
  if $SILENT; then return; fi
  if $QUIET; then return; fi
  echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
  # Warnings always show unless SILENT is true.
  # If QUIET is true, it still shows warnings (you could change this if you like).
  if $SILENT; then return; fi
  echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
  # Errors always show no matter what, except maybe 'dead silent' could skip them, but typically we want errors to appear.
  echo -e "${RED}[ERROR]${NC} $1" >&2
}

log_verbose() {
  # Verbose logs only show if VERBOSE or OBNOXIOUS is true.  
  # QUIET or SILENT modes override them.
  if $SILENT || $QUIET; then return; fi
  if $VERBOSE || $OBNOXIOUS; then
    echo -e "${BLUE}[VERBOSE]${NC} $1"
  fi
}

log_bold() {
  # Normal bold message - won't show if SILENT is set, does show in quiet mode for certain prompts.
  if $SILENT; then return; fi
  echo -e "${BOLD}$1${NC}"
}

# ------------------------------------------------------------------------------
# Obnoxious ASCII Art
# ------------------------------------------------------------------------------
ascii_obnoxious_success() {
  cat << "EOF"
 
 ███████╗██╗   ██╗ ██████╗  ██████╗ ██╗  ██╗██╗ ██████╗ 
 ██╔════╝╚██╗ ██╔╝██╔═══██╗██╔═══██╗██║ ██╔╝██║██╔════╝ 
 █████╗   ╚████╔╝ ██║   ██║██║   ██║█████╔╝ ██║██║  ███╗
 ██╔══╝    ╚██╔╝  ██║   ██║██║   ██║██╔═██╗ ██║██║   ██║
 ███████╗   ██║   ╚██████╔╝╚██████╔╝██║  ██╗██║╚██████╔╝
 ╚══════╝   ╚═╝    ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝ ╚═════╝ 
                                                        
          Operation completed successfully!
EOF
}

ascii_obnoxious_welcome() {
  cat << "EOF"

 $$$$$$\  $$\   $$\                     $$$$$$$\                      $$\                     
$$  __$$\ \__|  $$ |                    $$  __$$\                     $$ |                    
$$ /  \__|$$\ $$$$$$\    $$$$$$\        $$ |  $$ | $$$$$$\   $$$$$$\  $$ | $$$$$$\  $$\   $$\ 
\$$$$$$\  $$ |\_$$  _|  $$  __$$\       $$ |  $$ |$$  __$$\ $$  __$$\ $$ |$$  __$$\ $$ |  $$ |
 \____$$\ $$ |  $$ |    $$$$$$$$ |      $$ |  $$ |$$$$$$$$ |$$ /  $$ |$$ |$$ /  $$ |$$ |  $$ |
$$\   $$ |$$ |  $$ |$$\ $$   ____|      $$ |  $$ |$$   ____|$$ |  $$ |$$ |$$ |  $$ |$$ |  $$ |
\$$$$$$  |$$ |  \$$$$  |\$$$$$$$\       $$$$$$$  |\$$$$$$$\ $$$$$$$  |$$ |\$$$$$$  |\$$$$$$$ |
 \______/ \__|   \____/  \_______|      \_______/  \_______|$$  ____/ \__| \______/  \____$$ |
                                                            $$ |                    $$\   $$ |
                                                            $$ |                    \$$$$$$  |
                                                            \__|                     \______/ 

EOF
}

# ------------------------------------------------------------------------------
# Usage Function
# ------------------------------------------------------------------------------
usage() {
  echo -e "${MAGENTA}Usage: ${BOLD}$0 [-v|-q|-s|-o] <PROJECT_NAME> <S3_BUCKET>${NC}"
  echo -e "  -v | --verbose    : More detailed logs"
  echo -e "  -q | --quiet      : Minimal output, only success or error"
  echo -e "  -s | --silent     : No output unless there's an error"
  echo -e "  -o | --obnoxious  : Verbose + ASCII-art mania!"
  exit 1
}

# ------------------------------------------------------------------------------
# Parse Flags
# ------------------------------------------------------------------------------
# We'll parse flags first, then read positional args for PROJECT_NAME and S3_BUCKET.

while [[ $# -gt 0 ]]; do
  case "$1" in
    -v|--verbose)
      VERBOSE=true
      shift
      ;;
    -q|--quiet)
      QUIET=true
      shift
      ;;
    -s|--silent)
      SILENT=true
      shift
      ;;
    -o|--obnoxious)
      OBNOXIOUS=true
      VERBOSE=true    # Obnoxious implies verbose
      shift
      ;;
    -h|--help)
      usage
      ;;
    -*)
      echo -e "${RED}[ERROR]${NC} Unknown option: $1"
      usage
      ;;
    *)
      # We've reached the first non-flag argument => PROJECT_NAME
      break
      ;;
  esac
done

# ------------------------------------------------------------------------------
# After flags, read required positional args
# ------------------------------------------------------------------------------
PROJECT_NAME=$1
S3_BUCKET=$2

# ------------------------------------------------------------------------------
# Obnoxious Welcome
# ------------------------------------------------------------------------------
if $OBNOXIOUS && ! $SILENT && ! $QUIET; then
  ascii_obnoxious_welcome
fi

# ------------------------------------------------------------------------------
# Nx Root Finder
# ------------------------------------------------------------------------------
find_nx_root() {
  local current_dir
  current_dir="$(pwd)"
  while [ "$current_dir" != "/" ]; do
    if [ -f "$current_dir/nx.json" ] && [ -d "$current_dir/apps" ]; then
      echo "$current_dir"
      return
    fi
    current_dir="$(dirname "$current_dir")"
  done
  echo ""  # Return empty if not found
}

# ------------------------------------------------------------------------------
# Validate Nx Root
# ------------------------------------------------------------------------------
NX_ROOT="$(find_nx_root)"
if [[ -z "$NX_ROOT" ]]; then
  log_error "Could not locate an Nx root (missing nx.json or apps/ directory)."
  exit 1
fi
log_verbose "Nx root found at: $NX_ROOT"

# ------------------------------------------------------------------------------
# Check for missing args
# ------------------------------------------------------------------------------
if [[ -z "$PROJECT_NAME" || -z "$S3_BUCKET" ]]; then
  log_error "Missing required arguments. Usage: $0 [-v|-q|-s|-o] <PROJECT_NAME> <S3_BUCKET>"
  log_warn "Example: $0 charlesmbrady charlesmbrady-test-website-content"

  if ! $SILENT; then
    read -rp "$(echo -e "${YELLOW}Do you want to continue anyway? (y/n) ${NC}")" CONTINUE_ANYWAY
    if [[ "$CONTINUE_ANYWAY" != "y" && "$CONTINUE_ANYWAY" != "Y" ]]; then
      log_error "Aborting script due to missing arguments."
      exit 1
    fi
  fi
fi

# ------------------------------------------------------------------------------
# Validate Directory Structure
# ------------------------------------------------------------------------------
APPS_DIR="$NX_ROOT/apps"
TARGET_OUT_DIR="$APPS_DIR/$PROJECT_NAME/out"

if [[ ! -d "$APPS_DIR" ]]; then
  log_error "Directory '$APPS_DIR' does not exist. Invalid Nx project structure."
  exit 1
fi

if [[ ! -d "$APPS_DIR/$PROJECT_NAME" ]]; then
  log_warn "Directory '$APPS_DIR/$PROJECT_NAME' does not exist."
  if ! $SILENT; then
    read -rp "$(echo -e "${YELLOW}Continue anyway? (y/n) ${NC}")" CONTINUE_NO_PROJECT
    if [[ "$CONTINUE_NO_PROJECT" != "y" && "$CONTINUE_NO_PROJECT" != "Y" ]]; then
      log_error "Aborting script."
      exit 1
    fi
  fi
fi

if [[ ! -d "$TARGET_OUT_DIR" ]]; then
  log_warn "'out' directory not found at '$TARGET_OUT_DIR'."
  if ! $SILENT; then
    read -rp "$(echo -e "${YELLOW}Are you sure you want to continue? (y/n) ${NC}")" CONTINUE_NO_OUT
    if [[ "$CONTINUE_NO_OUT" != "y" && "$CONTINUE_NO_OUT" != "Y" ]]; then
      log_error "Aborting script."
      exit 1
    fi
  fi
fi

# ------------------------------------------------------------------------------
# Default Values if user wants to continue
# ------------------------------------------------------------------------------
if [[ -z "$PROJECT_NAME" ]]; then
  PROJECT_NAME="UnknownProject"
  log_warn "Setting PROJECT_NAME to 'UnknownProject'."
fi
if [[ -z "$S3_BUCKET" ]]; then
  S3_BUCKET="UnknownBucket"
  log_warn "Setting S3_BUCKET to 'UnknownBucket'."
fi

# ------------------------------------------------------------------------------
# Final Confirmation Prompt (only if not silent)
# ------------------------------------------------------------------------------
if ! $SILENT; then
  log_bold "About to sync '$APPS_DIR/$PROJECT_NAME/out' to S3 bucket: $S3_BUCKET"
  log_bold "Nx root directory: $NX_ROOT"
  echo -e "${BOLD}---------------------------------------------------------------${NC}"

  read -rp "$(echo -e "${YELLOW}Proceed with sync? (y/n) ${NC}")" PROCEED_SYNC
  if [[ "$PROCEED_SYNC" != "y" && "$PROCEED_SYNC" != "Y" ]]; then
    log_error "Sync aborted by user."
    exit 1
  fi
fi

# ------------------------------------------------------------------------------
# Perform the Sync
# ------------------------------------------------------------------------------
SYNC_SOURCE="$TARGET_OUT_DIR"
log_verbose "Sync source: $SYNC_SOURCE"
log_verbose "S3 bucket:   $S3_BUCKET"
log_verbose "Excluding 'portfolio/*' during sync."

# Quiet/silent users won't see normal info logs, but they'll still see errors.
if ! $SILENT && ! $QUIET; then
  log_info "Starting sync to s3://${S3_BUCKET}/..."
fi

aws s3 sync "${SYNC_SOURCE}" "s3://${S3_BUCKET}/" \
  --delete \
  --exclude "portfolio/*"
SYNC_EXIT_CODE=$?

if [[ $SYNC_EXIT_CODE -ne 0 ]]; then
  # Always show error, regardless of verbosity.
  log_error "AWS S3 sync failed with exit code ${SYNC_EXIT_CODE}."
  exit $SYNC_EXIT_CODE
fi

# ------------------------------------------------------------------------------
# Success Messages
# ------------------------------------------------------------------------------
if $SILENT; then
  # Dead silent mode => no output at all if success
  exit 0
elif $QUIET; then
  # Quiet => minimal success message
  echo "Success"
  exit 0
elif $OBNOXIOUS; then
  # Obnoxious => ASCII art mania
  ascii_obnoxious_success
else
  # Normal or verbose => standard success message
  log_info "Sync to s3://${S3_BUCKET}/ completed successfully!"
fi

exit 0
