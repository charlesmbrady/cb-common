# AI Chat Application - Local Development Setup

## Prerequisites

### AWS Credentials Configuration

For local development, you need valid AWS credentials configured. The API uses AWS Bedrock AgentCore which requires authentication.

#### Option 1: AWS CLI Configuration (Recommended)

1. Install AWS CLI if not already installed:
   ```bash
   brew install awscli  # macOS
   ```

2. Configure your credentials:
   ```bash
   aws configure
   ```

3. Enter your credentials when prompted:
   - AWS Access Key ID
   - AWS Secret Access Key
   - Default region: `us-east-1`
   - Default output format: `json`

4. Verify credentials work:
   ```bash
   aws sts get-caller-identity
   ```

#### Option 2: Environment Variables

Set these in your shell or `.env` file:
```bash
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_REGION=us-east-1
```

## Running the Application

### Backend API (api-services)

```bash
# From cb-common root
npm run serve:api-services

# Or with environment variable
LOCAL_SERVER=true npm run serve:api-services
```

The API will be available at `http://localhost:3333`

### Frontend (apps)

```bash
# From cb-common root
npm run serve:apps
```

The frontend will be available at `http://localhost:4200`

Navigate to `/aichat` to access the AI Chat interface.

## Troubleshooting

### "AccessDeniedException: The security token included in the request is invalid"

This error means your AWS credentials are not configured correctly. Solutions:

1. **Check AWS credentials are configured:**
   ```bash
   aws sts get-caller-identity
   ```

2. **Ensure the IAM user has the required permissions:**
   - `bedrock-agentcore:InvokeAgentRuntime`
   - `bedrock-agentcore:GetWorkloadAccessToken`
   - See `terraform-aws-charlesmbrady/iam_policies/lambda_services_middleware.json` for full policy

3. **Verify the credentials are being loaded:**
   - The API should use credentials from `~/.aws/credentials` by default
   - Make sure the `[default]` profile has valid credentials

4. **Alternative: Use a specific AWS profile:**
   ```bash
   AWS_PROFILE=your-profile npm run serve:api-services
   ```

### "Cannot connect to API"

If the frontend can't connect to the backend:

1. Check the API is running on port 3333
2. Verify the API URL in `apps/apps/src/app/subapps/AIChat/services/agentcore.service.ts`
3. For local development, you may need to update the baseUrl to:
   ```typescript
   this.baseUrl = 'http://localhost:3333/charlesmbrady/Test';
   ```

## Environment Variables

Create a `.env` file in the `apps/api-services` directory:

```env
LOCAL_SERVER=true
AWS_REGION=us-east-1
PORT=3333
API_PREFIX=

# Optional: Override AgentCore settings
AGENTCORE_RUNTIME_ARN=arn:aws:bedrock-agentcore:us-east-1:632785536297:runtime/charlesmbrady_assistant_Test-gEKsvHG0zU
```

## Architecture

```
Frontend (React) 
  → http://localhost:3333/charlesmbrady/Test/agentcore/invoke
    → AgentCore Service (Express)
      → AWS Bedrock AgentCore (via SDK)
        → AgentCore Runtime Container (Python)
```

## API Endpoints

### POST `/agentcore/invoke`
Invoke the AI assistant

**Request:**
```json
{
  "prompt": "Hello, what can you help with?",
  "sessionId": "optional-session-id"
}
```

**Response:**
```json
{
  "status": "success",
  "response": "{...nested JSON response...}",
  "sessionId": "session-1234567890-abc",
  "actorId": "user-id",
  "invocationMethod": "SDK"
}
```

### GET `/agentcore/health`
Health check endpoint

### GET `/agentcore/config`
Get AgentCore configuration
