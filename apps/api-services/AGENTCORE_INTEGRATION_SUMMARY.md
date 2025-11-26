# AgentCore API Integration - Summary

## What Was Added

### Backend (Express API)

**New Files Created:**

1. **`src/services/agentcore.service.ts`** - Service layer for AgentCore integration

   - Handles communication with AWS Bedrock AgentCore
   - Supports both streaming and non-streaming invocations
   - Retrieves configuration from SSM Parameter Store
   - Manages session IDs and authentication

2. **`src/controllers/agentcore.controller.ts`** - API controllers

   - `POST /agentcore/invoke` - Streaming endpoint (Server-Sent Events)
   - `POST /agentcore/invoke-sync` - Non-streaming endpoint (single response)
   - `GET /agentcore/config` - Get AgentCore configuration
   - `GET /agentcore/health` - Health check endpoint

3. **`src/routes/agentcore.routes.ts`** - Route definitions

4. **`AGENTCORE_TESTING_GUIDE.md`** - Complete testing documentation

5. **`test-agentcore-api.sh`** - Automated test script

**Modified Files:**

1. **`src/main.ts`** - Registered AgentCore routes
2. **`package.json`** - Added `@aws-sdk/client-ssm` dependency

## API Endpoints

### Base URL

- Local: `http://localhost:3333/agentcore`
- Production: `https://api.charlesmbrady.com/agentcore` (after deployment)

### Endpoints Summary

| Method | Path           | Auth Required | Description                    |
| ------ | -------------- | ------------- | ------------------------------ |
| GET    | `/health`      | No            | Health check                   |
| GET    | `/config`      | No            | Get AgentCore configuration    |
| POST   | `/invoke-sync` | Yes           | Invoke agent (single response) |
| POST   | `/invoke`      | Yes           | Invoke agent (streaming)       |

## Setup Steps

### 1. Install Dependencies

```bash
cd /Users/charlesbrady/Desktop/Charlava_25/cb-common
npm install @aws-sdk/client-ssm@^3.840.0
```

### 2. Create SSM Parameter

```bash
aws ssm put-parameter \
  --name "/charlesmbrady/Test/agentcore/runtime_name" \
  --value "charlesmbrady_assistant_Test" \
  --type String \
  --overwrite \
  --region us-east-1
```

### 3. Start Local Server

```bash
nx run api-services:serve
```

Expected output:

```
🚀 Local development server is running at http://localhost:3333
```

### 4. Test Endpoints

**Health Check (no auth)**:

```bash
curl http://localhost:3333/agentcore/health
```

**With automated script**:

```bash
./apps/api-services/test-agentcore-api.sh
```

**With authentication** (requires Cognito token):

```bash
export COGNITO_TOKEN="your-token-here"
curl -X POST http://localhost:3333/agentcore/invoke-sync \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $COGNITO_TOKEN" \
  -d '{
    "prompt": "What can you help me with?",
    "sessionId": "test-123",
    "actorId": "user@example.com"
  }'
```

## Frontend Integration

### Getting Auth Token in React

```typescript
import { useAuth } from 'react-oidc-context';

function ChatComponent() {
  const auth = useAuth();
  const token = auth.user?.access_token;

  // Use token in API calls
}
```

### Example API Call

```typescript
async function invokeAgent(prompt: string, token: string) {
  const response = await fetch('http://localhost:3333/agentcore/invoke-sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      prompt,
      sessionId: `session-${Date.now()}`,
      actorId: 'user@example.com',
    }),
  });

  return await response.json();
}
```

### Streaming Example

```typescript
async function invokeAgentStreaming(prompt: string, token: string, onChunk: (data: string) => void) {
  const response = await fetch('http://localhost:3333/agentcore/invoke', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      prompt,
      sessionId: `session-${Date.now()}`,
    }),
  });

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader!.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        onChunk(line.substring(6));
      }
    }
  }
}
```

## Authentication Flow

1. User logs in via Cognito in React app
2. React app receives access token
3. Frontend sends requests to Express API with `Authorization: Bearer <token>` header
4. Express API forwards request to AgentCore with the bearer token
5. AgentCore validates token and processes request
6. Response streams back through Express to frontend

## Architecture

```
React Frontend
     ↓ (HTTP + Bearer Token)
Express API (/agentcore)
     ↓ (HTTPS + Bearer Token)
AWS Bedrock AgentCore
     ↓
Claude 3.5 Sonnet Model
```

## Request/Response Format

### Request (Non-Streaming)

```json
{
  "prompt": "What can you help me with?",
  "sessionId": "session-123456",
  "actorId": "user@example.com"
}
```

### Response (Non-Streaming)

```json
{
  "status": "success",
  "response": "I can help you with:\n• Product technical specifications...",
  "elapsed_sec": 0.842
}
```

### Response (Streaming)

```
data: I
data: can
data: help
data: you
data: with
data: ...
```

## Environment Variables

Required for the Express API:

| Variable         | Description      | Example        |
| ---------------- | ---------------- | -------------- |
| `AWS_REGION`     | AWS region       | `us-east-1`    |
| `AWS_ACCOUNT_ID` | AWS account ID   | `632785536297` |
| `ENVIRONMENT`    | Environment name | `Test`         |

## Next Steps

### 1. Create React Chat UI Component

```typescript
// apps/apps/src/components/AgentChat.tsx
import React, { useState } from 'react';
import { useAuth } from 'react-oidc-context';

export function AgentChat() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState('');
  const auth = useAuth();

  const sendMessage = async () => {
    // Implementation using API calls above
  };

  return <div className="chat-container">{/* Chat UI */}</div>;
}
```

### 2. Add Route in React App

```typescript
// apps/apps/src/app/app.tsx
import { AgentChat } from '../components/AgentChat';

function App() {
  return (
    <Routes>
      <Route path="/chat" element={<AgentChat />} />
      {/* other routes */}
    </Routes>
  );
}
```

### 3. Deploy to AWS

```bash
# Build API
nx build api-services

# Deploy via Terraform
cd ../terraform-aws-charlesmbrady
terraform apply
```

## Troubleshooting

### Common Issues

**"Authorization token required"**

- Ensure `Authorization: Bearer <token>` header is present
- Verify token is valid (not expired)

**"Runtime name not found in SSM"**

- Create SSM parameter with runtime name (see Setup Steps #2)

**"Failed to invoke agent"**

- Verify AgentCore runtime exists in AWS Console
- Check CloudWatch logs for detailed errors
- Ensure bearer token has correct permissions

**CORS errors in browser**

- CORS is already enabled in Express
- Verify request URL is correct
- Check browser console for details

## Testing Checklist

- [ ] Install dependencies (`npm install`)
- [ ] Create SSM parameter with runtime name
- [ ] Start local server (`nx run api-services:serve`)
- [ ] Test health endpoint (no auth needed)
- [ ] Test config endpoint
- [ ] Get Cognito auth token
- [ ] Test sync invoke endpoint with auth
- [ ] Test streaming invoke endpoint
- [ ] Build React chat component
- [ ] Test end-to-end flow
- [ ] Deploy to AWS
- [ ] Test production endpoints

## Documentation

- **`AGENTCORE_TESTING_GUIDE.md`** - Complete testing guide with curl examples
- **`test-agentcore-api.sh`** - Automated test script

## Support

For issues or questions:

1. Check CloudWatch logs for API errors
2. Review `AGENTCORE_TESTING_GUIDE.md`
3. Verify AgentCore deployment in AWS Console
4. Check Terraform outputs for correct ARNs

---

**All endpoints are now ready for testing and frontend integration!** 🎉
