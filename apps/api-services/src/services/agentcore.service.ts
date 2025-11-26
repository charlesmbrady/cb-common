import {
  BedrockAgentCoreClient,
  InvokeAgentRuntimeCommand,
} from '@aws-sdk/client-bedrock-agentcore';
import { SignatureV4 } from '@aws-sdk/signature-v4';
import { HttpRequest } from '@aws-sdk/protocol-http';
import { Sha256 } from '@aws-crypto/sha256-js';
import { defaultProvider } from '@aws-sdk/credential-provider-node';

interface InvokePayload {
  prompt: string;
  sessionId?: string;
  actorId?: string;
}

interface AgentCoreConfig {
  agentArn: string;
  region: string;
  useHttpInvocation?: boolean; // Toggle between SDK and HTTP invocation
  gatewayEndpoint?: string; // Optional gateway HTTP endpoint
}

export class AgentCoreService {
  private config: AgentCoreConfig;
  private client: BedrockAgentCoreClient;

  constructor() {
    const region = process.env.AWS_REGION || 'us-east-1';
    
    // Check if we should use HTTP invocation (for direct gateway calls)
    const useHttp = process.env.AGENTCORE_USE_HTTP === 'true';
    const gatewayEndpoint = process.env.AGENTCORE_GATEWAY_ENDPOINT;

    this.config = {
      // Full runtime ARN from AWS Console
      agentArn:
        process.env.AGENTCORE_RUNTIME_ARN ||
        'arn:aws:bedrock-agentcore:us-east-1:632785536297:runtime/charlesmbrady_assistant_Test-gEKsvHG0zU',
      region,
      useHttpInvocation: useHttp,
      gatewayEndpoint,
    };

    // AWS SDK client with automatic credential detection
    // Uses Lambda execution role when deployed, ~/.aws/credentials locally
    this.client = new BedrockAgentCoreClient({
      region: this.config.region,
      // For local development, credentials provider will use AWS CLI config
      credentials: process.env.LOCAL_SERVER === 'true' 
        ? defaultProvider() 
        : undefined,
    });
  }  /**
   * Invoke agent using AWS SDK (with SigV4 signing)
   * Bearer token is passed for user identity, AWS credentials for authorization
   */
  async invokeAgent(
    payload: InvokePayload,
    bearerToken?: string
  ): Promise<any> {
    // Try HTTP invocation if configured
    if (this.config.useHttpInvocation && this.config.gatewayEndpoint) {
      return this.invokeViaHttp(payload, bearerToken);
    }

    // Otherwise use SDK invocation
    return this.invokeViaSDK(payload, bearerToken);
  }

  /**
   * Invoke via AWS SDK
   */
  private async invokeViaSDK(
    payload: InvokePayload,
    bearerToken?: string
  ): Promise<any> {
    const sessionId = payload.sessionId || this.generateSessionId();

    const input = {
      agentRuntimeArn: this.config.agentArn,
      runtimeSessionId: sessionId,
      payload: new TextEncoder().encode(
        JSON.stringify({
          inputText: payload.prompt,
          userId: payload.actorId || 'anonymous',
        })
      ),
    };

    try {
      const command = new InvokeAgentRuntimeCommand(input);
      const response = await this.client.send(command);

      // The response contains a streaming blob that needs to be converted
      let responseText = '';

      if (response.response) {
        // Convert the streaming response to string
        responseText = await response.response.transformToString();
      }

      return {
        status: 'success',
        response: responseText,
        sessionId,
        actorId: payload.actorId,
        invocationMethod: 'SDK',
      };
    } catch (error) {
      console.error('AgentCore SDK invocation error:', error);

      // If SDK fails and we have a gateway endpoint, try HTTP as fallback
      if (this.config.gatewayEndpoint) {
        console.log('SDK invocation failed, attempting HTTP fallback...');
        return this.invokeViaHttp(payload, bearerToken);
      }

      throw new Error(
        `Agent invocation failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Invoke via HTTP with SigV4 signing
   */
  private async invokeViaHttp(
    payload: InvokePayload,
    bearerToken?: string
  ): Promise<any> {
    if (!this.config.gatewayEndpoint) {
      throw new Error('Gateway endpoint not configured for HTTP invocation');
    }

    const sessionId = payload.sessionId || this.generateSessionId();
    const requestBody = JSON.stringify({
      inputText: payload.prompt,
      userId: payload.actorId || 'anonymous',
    });

    try {
      // Parse the gateway endpoint URL
      const url = new URL(this.config.gatewayEndpoint);

      // Create HTTP request
      const request = new HttpRequest({
        method: 'POST',
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port ? parseInt(url.port) : undefined,
        path: url.pathname,
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Id': sessionId,
          host: url.hostname,
        },
        body: requestBody,
      });

      // Sign the request with SigV4
      const signer = new SignatureV4({
        service: 'bedrock-agentcore',
        region: this.config.region,
        credentials: defaultProvider(),
        sha256: Sha256,
      });

      const signedRequest = await signer.sign(request);

      // Make the HTTP call
      const response = await fetch(this.config.gatewayEndpoint, {
        method: signedRequest.method,
        headers: signedRequest.headers,
        body: signedRequest.body,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const responseData = await response.json();

      return {
        status: 'success',
        response: responseData,
        sessionId,
        actorId: payload.actorId,
        invocationMethod: 'HTTP',
      };
    } catch (error) {
      console.error('AgentCore HTTP invocation error:', error);
      throw new Error(
        `Agent HTTP invocation failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  /**
   * Get current configuration
   */
  getConfig(): AgentCoreConfig {
    return this.config;
  }

  /**
   * Health check
   */
  healthCheck(): { status: string; config: AgentCoreConfig } {
    return {
      status: 'healthy',
      config: this.config,
    };
  }

  /**
   * Generate a unique session ID (must be 33+ chars)
   */
  private generateSessionId(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2);
    return `session-${timestamp}-${random}`.padEnd(33, 'x');
  }
}
