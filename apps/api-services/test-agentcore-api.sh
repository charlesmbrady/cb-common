#!/bin/bash

# AgentCore API Test Script
# This script tests all the AgentCore endpoints

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

API_BASE_URL="${API_BASE_URL:-http://localhost:3333}"
TOKEN="${COGNITO_TOKEN:-}"

echo -e "${YELLOW}======================================${NC}"
echo -e "${YELLOW}AgentCore API Test Script${NC}"
echo -e "${YELLOW}======================================${NC}"
echo ""
echo "API Base URL: $API_BASE_URL"
echo ""

# Test 1: Health Check
echo -e "${YELLOW}[1] Testing Health Check...${NC}"
HEALTH_RESPONSE=$(curl -s "$API_BASE_URL/agentcore/health")
if echo "$HEALTH_RESPONSE" | grep -q "healthy"; then
    echo -e "${GREEN}✓ Health check passed${NC}"
    echo "$HEALTH_RESPONSE" | jq '.' 2>/dev/null || echo "$HEALTH_RESPONSE"
else
    echo -e "${RED}✗ Health check failed${NC}"
    echo "$HEALTH_RESPONSE"
fi
echo ""

# Test 2: Get Configuration
echo -e "${YELLOW}[2] Testing Configuration Endpoint...${NC}"
CONFIG_RESPONSE=$(curl -s "$API_BASE_URL/agentcore/config")
if echo "$CONFIG_RESPONSE" | grep -q "agentArn"; then
    echo -e "${GREEN}✓ Configuration endpoint passed${NC}"
    echo "$CONFIG_RESPONSE" | jq '.' 2>/dev/null || echo "$CONFIG_RESPONSE"
else
    echo -e "${RED}✗ Configuration endpoint failed${NC}"
    echo "$CONFIG_RESPONSE"
fi
echo ""

# Test 3: Invoke Agent (only if token provided)
if [ -n "$TOKEN" ]; then
    echo -e "${YELLOW}[3] Testing Agent Invocation (Sync)...${NC}"
    INVOKE_RESPONSE=$(curl -s -X POST "$API_BASE_URL/agentcore/invoke-sync" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $TOKEN" \
        -d '{
            "prompt": "What can you help me with?",
            "sessionId": "test-'"$(date +%s)"'",
            "actorId": "test@example.com"
        }')
    
    if echo "$INVOKE_RESPONSE" | grep -q "status"; then
        echo -e "${GREEN}✓ Agent invocation passed${NC}"
        echo "$INVOKE_RESPONSE" | jq '.' 2>/dev/null || echo "$INVOKE_RESPONSE"
    else
        echo -e "${RED}✗ Agent invocation failed${NC}"
        echo "$INVOKE_RESPONSE"
    fi
else
    echo -e "${YELLOW}[3] Skipping Agent Invocation (no token provided)${NC}"
    echo "To test with authentication, set COGNITO_TOKEN environment variable:"
    echo "  export COGNITO_TOKEN='your-token-here'"
    echo "  ./test-agentcore-api.sh"
fi
echo ""

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}Testing Complete${NC}"
echo -e "${GREEN}======================================${NC}"
