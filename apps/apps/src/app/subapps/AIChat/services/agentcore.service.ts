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
    // Use environment variable or detect local vs production
    const isLocal = window.location.hostname === 'localhost';

    this.baseUrl = isLocal
      ? 'https://api-test.charlesmbrady.com/services' // Local development
      : process.env.NX_API_BASE_URL ||
        'https://api.charlesmbrady.com/charlesmbrady/Test';
  }

  /**
   * Set the auth token getter function
   * This should be called from a React component with access to useUser hook
   */
  setAuthTokenGetter(getter: () => Promise<string | null>) {
    this.getAuthToken = getter;
  }

  async invokeAgent(request: InvokeAgentRequest): Promise<AgentCoreResponse> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Add authorization header if auth token is available
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

  /**
   * Parse the nested response string from AgentCore
   * The API returns a JSON string inside the response field
   */
  parseResponse(apiResponse: AgentCoreResponse): {
    status: string;
    response: string;
    elapsed_sec?: number;
  } {
    try {
      // The response field contains a JSON string
      const parsed = JSON.parse(apiResponse.response);
      return parsed;
    } catch (error) {
      // If parsing fails, return the raw response
      return {
        status: 'success',
        response: apiResponse.response,
      };
    }
  }
}

export const agentCoreService = new AgentCoreService();
