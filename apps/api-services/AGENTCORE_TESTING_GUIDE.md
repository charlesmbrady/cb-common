# AgentCore API Testing Guide

## Overview

The Express API now includes endpoints to interact with the AWS Bedrock AgentCore agent. This guide shows you how to test the endpoints locally and in production.

## Prerequisites

1. **Install dependencies**:

   ```bash
   cd /Users/charlesbrady/Desktop/Charlava_25/cb-common
   npm install
   ```

2. **Configure environment variables** in `.env` or export them:

   ```bash
   export AWS_REGION=us-east-1
   export AWS_ACCOUNT_ID=632785536297
   export ENVIRONMENT=Test
   ```

3. **Ensure SSM parameter exists** with runtime name:
   ```bash
   aws ssm put-parameter \
     --name "/charlesmbrady/Test/agentcore/runtime_name" \
     --value "charlesmbrady_assistant_Test" \
     --type String \
     --overwrite \
     --region us-east-1
   ```

## API Endpoints

### Base URL

- **Local**: `http://localhost:3333/agentcore`
- **Production**: `https://api.charlesmbrady.com/agentcore`

### Endpoints

#### 1. Health Check

```bash
GET /agentcore/health
```

**Test locally**:

```bash
curl http://localhost:3333/agentcore/health
```

**Expected response**:

```json
{
  "status": "healthy",
  "config": {
    "agentArn": "arn:aws:bedrock-agentcore:us-east-1:632785536297:runtime/charlesmbrady_assistant_Test",
    "region": "us-east-1",
    "endpoint": "https://bedrock-agentcore.us-east-1.amazonaws.com"
  }
}
```

#### 2. Get Configuration

```bash
GET /agentcore/config
```

**Test locally**:

```bash
curl http://localhost:3333/agentcore/config
```

#### 3. Invoke Agent (Non-Streaming)

```bash
POST /agentcore/invoke-sync
Content-Type: application/json
Authorization: Bearer <YOUR_TOKEN>
```

**Test locally** (requires Cognito token):

```bash
# First, get a Cognito token (see "Getting Auth Token" section below)
export TOKEN="your-cognito-access-token"

curl -X POST http://localhost:3333/agentcore/invoke-sync \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "prompt": "What can you help me with?",
    "sessionId": "test-session-123",
    "actorId": "user@example.com"
  }'
```

**Expected response**:

```json
{
  "status": "success",
  "response": "I can help you with:\n• Product technical specifications...",
  "elapsed_sec": 0.842
}
```

#### 4. Invoke Agent (Streaming)

```bash
POST /agentcore/invoke
Content-Type: application/json
Authorization: Bearer <YOUR_TOKEN>
```

**Test locally**:

```bash
curl -X POST http://localhost:3333/agentcore/invoke \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -N \
  -d '{
    "prompt": "Tell me about your services",
    "sessionId": "test-session-123",
    "actorId": "user@example.com"
  }'
```

**Expected response** (Server-Sent Events):

```
data: I
data: can
data: help
data: you
data: with
...
```

## Getting Authentication Token

### Option 1: From React App (Recommended)

Your React app using Cognito authentication will automatically get the token. Access it in your frontend:

```typescript
// In your React component
import { useAuth } from 'react-oidc-context';

function ChatComponent() {
  const auth = useAuth();
  const token = auth.user?.access_token;

  const invokeAgent = async (prompt: string) => {
    const response = await fetch('http://localhost:3333/agentcore/invoke-sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        prompt,
        sessionId: 'session-' + Date.now(),
        actorId: auth.user?.profile.email,
      }),
    });
    return await response.json();
  };

  // Use invokeAgent in your component
}
```

### Option 2: Manual Token Generation (For Testing)

Use AWS Cognito to get a token manually:

```bash
# Install AWS CLI if not already installed

# Authenticate and get token
aws cognito-idp initiate-auth \
  --auth-flow USER_PASSWORD_AUTH \
  --client-id YOUR_COGNITO_CLIENT_ID \
  --auth-parameters USERNAME=your-email,PASSWORD=your-password \
  --region us-east-1 \
  --query 'AuthenticationResult.AccessToken' \
  --output text
```

Save the output as your `TOKEN` variable.

### Option 3: Using Postman

1. Create a new request in Postman
2. Set URL to `http://localhost:3333/agentcore/invoke-sync`
3. Set method to `POST`
4. Go to **Authorization** tab
5. Select **Bearer Token**
6. Paste your Cognito token
7. Go to **Body** tab
8. Select **raw** and **JSON**
9. Paste request body:
   ```json
   {
     "prompt": "What can you help me with?",
     "sessionId": "test-123",
     "actorId": "test@example.com"
   }
   ```

## Testing Workflow

### 1. Start Local Server

```bash
cd /Users/charlesbrady/Desktop/Charlava_25/cb-common
nx run api-services:serve
```

Wait for:

```
🚀 Local development server is running at http://localhost:3333
```

### 2. Test Health Check (No Auth Required)

```bash
curl http://localhost:3333/agentcore/health
```

Should return `{"status":"healthy",...}`

### 3. Test Config Endpoint

```bash
curl http://localhost:3333/agentcore/config
```

Should return agent ARN and configuration.

### 4. Test Agent Invocation (Requires Auth)

```bash
# Get Cognito token first
TOKEN="your-cognito-token"

# Test sync endpoint
curl -X POST http://localhost:3333/agentcore/invoke-sync \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "prompt": "What can you help me with?",
    "sessionId": "test-session-' $(date +%s) '",
    "actorId": "test@example.com"
  }'
```

### 5. Test Streaming Endpoint

```bash
curl -X POST http://localhost:3333/agentcore/invoke \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -N \
  -d '{
    "prompt": "Hello, tell me what you can do",
    "sessionId": "test-stream-123"
  }'
```

## Frontend Integration Example

### React Component with Streaming

```typescript
import React, { useState } from 'react';

export function AgentChat() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setMessages((prev) => [...prev, { role: 'user', content: input }]);

    try {
      const token = 'your-auth-token'; // Get from your auth context
      const sessionId = `session-${Date.now()}`;

      // Use EventSource for streaming
      const url = new URL('http://localhost:3333/agentcore/invoke');

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt: input,
          sessionId,
          actorId: 'user@example.com',
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.substring(6);
            assistantMessage += data;

            // Update UI with streaming text
            setMessages((prev) => {
              const newMessages = [...prev];
              if (newMessages[newMessages.length - 1]?.role === 'assistant') {
                newMessages[newMessages.length - 1].content = assistantMessage;
              } else {
                newMessages.push({ role: 'assistant', content: assistantMessage });
              }
              return newMessages;
            });
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, there was an error processing your request.',
        },
      ]);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  return (
    <div>
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role}>
            {msg.content}
          </div>
        ))}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} disabled={loading} />
      <button onClick={sendMessage} disabled={loading}>
        Send
      </button>
    </div>
  );
}
```

## Troubleshooting

### Error: "Authorization token required"

**Cause**: Missing or invalid `Authorization` header.

**Solution**: Ensure you're sending `Authorization: Bearer <token>` header with valid Cognito token.

### Error: "Runtime name not found in SSM"

**Cause**: SSM parameter `/charlesmbrady/Test/agentcore/runtime_name` doesn't exist.

**Solution**:

```bash
aws ssm put-parameter \
  --name "/charlesmbrady/Test/agentcore/runtime_name" \
  --value "charlesmbrady_assistant_Test" \
  --type String \
  --overwrite \
  --region us-east-1
```

### Error: "Failed to invoke agent endpoint"

**Causes**:

1. Runtime not created in AWS Bedrock Console
2. Invalid bearer token
3. Network/permission issues

**Solutions**:

1. Verify runtime exists: AWS Console → Bedrock → AgentCore → Runtimes
2. Test token with health check first
3. Check CloudWatch logs for detailed errors

### CORS Errors in Browser

**Cause**: Frontend making request from different origin.

**Solution**: CORS is already enabled in the Express app. If issues persist, check that the request includes credentials:

```typescript
fetch(url, {
  credentials: 'include', // If using cookies
  // ... other options
});
```

## Production Deployment

Once tested locally, deploy to Lambda:

```bash
# Build the API
cd /Users/charlesbrady/Desktop/Charlava_25/cb-common
nx build api-services

# Deploy with Terraform (from terraform directory)
cd /Users/charlesbrady/Desktop/Charlava_25/terraform-aws-charlesmbrady
terraform apply
```

Then test production endpoint:

```bash
curl -X POST https://api.charlesmbrady.com/agentcore/invoke-sync \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "prompt": "What can you help me with?",
    "sessionId": "prod-test-123"
  }'
```

## Next Steps

1. **Create React Chat UI**: Build a chat interface component
2. **Add Session Management**: Store session IDs in local storage
3. **Implement Message History**: Display conversation history
4. **Add Typing Indicators**: Show when agent is thinking
5. **Error Handling**: Display user-friendly error messages
6. **Markdown Rendering**: Render formatted responses
7. **Link Detection**: Make URLs clickable in responses

See `FRONTEND_EXAMPLE.md` for complete React component examples.
