#!/bin/bash

# File: ./scripts/print_files.sh
# Description: Prints specified files and directories to ai_context.txt with headers.

# Define output file
OUTPUT_FILE="./ai_context.txt"

# Clear the output file if it exists
> "$OUTPUT_FILE"

# Function to append file content with header
append_file() {
  local filepath="$1"
  
  if [ -f "$filepath" ]; then
    echo "=== Start of $filepath ===" >> "$OUTPUT_FILE"
    cat "$filepath" >> "$OUTPUT_FILE"
    echo -e "\n=== End of $filepath ===\n" >> "$OUTPUT_FILE"
  else
    echo "Warning: $filepath does not exist or is not a regular file." >&2
  fi
}

# Function to append directory contents with header
append_directory() {
  local dirpath="$1"
  
  if [ -d "$dirpath" ]; then
    # Find all files recursively in the directory
    while IFS= read -r -d '' file; do
      append_file "$file"
    done < <(find "$dirpath" -type f -print0)
  else
    echo "Warning: $dirpath does not exist or is not a directory." >&2
  fi
}

# List of specific files to include
SPECIFIC_FILES=(
  "./tsconfig.base.json"
  "./nx.json"
  "./package.json"
)

# Directory to include
DIRECTORY="./apps/api-services"

# Append each specific file
for file in "${SPECIFIC_FILES[@]}"; do
  append_file "$file"
done

# Append all files in the specified directory
append_directory "$DIRECTORY"

echo "All specified files have been printed to $OUTPUT_FILE."
