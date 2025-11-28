// This file is deprecated - use useApiLazy hook directly in components
// Keeping for backward compatibility during migration

import axios from 'axios';

export interface AgentCoreResponse {
  status: string;
  response: string;
  sessionId: string;
  actorId?: string;
  invocationMethod?: string;
}

export interface InvokeAgentRequest {
  prompt: string;
  sessionId?: string;
}

class AgentCoreService {
  private baseUrl: string;
  private getAuthToken: (() => Promise<string | null>) | null = null;

  constructor() {
    // DEPRECATED: This hardcoded URL logic should not be used
    // Use the useApiLazy hook with config.apiUrl instead
    const isLocal = window.location.hostname === 'localhost';

    this.baseUrl = isLocal
      ? 'https://api-test.charlesmbrady.com/services'
      : process.env.NX_API_BASE_URL ||
        'https://api.charlesmbrady.com/charlesmbrady/Test';
  }

  setAuthTokenGetter(getter: () => Promise<string | null>) {
    this.getAuthToken = getter;
  }

  async invokeAgent(request: InvokeAgentRequest): Promise<AgentCoreResponse> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (this.getAuthToken) {
        const token = await this.getAuthToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      const response = await axios.post<AgentCoreResponse>(
        `${this.baseUrl}/agentcore/invoke`,
        request,
        { headers }
      );

      return response.data;
    } catch (error) {
      console.error('Error invoking agent:', error);
      throw error;
    }
  }

  parseResponse(apiResponse: AgentCoreResponse): {
    status: string;
    response: string;
    elapsed_sec?: number;
  } {
    try {
      const parsed = JSON.parse(apiResponse.response);
      return parsed;
    } catch (error) {
      return {
        status: 'success',
        response: apiResponse.response,
      };
    }
  }
}

export const agentCoreService = new AgentCoreService();
