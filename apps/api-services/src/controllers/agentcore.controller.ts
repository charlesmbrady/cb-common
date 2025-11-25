import { Request, Response, RequestHandler } from 'express';
import { AgentCoreService } from '../services/agentcore.service';
import { getCurrentInvoke } from '@cb-common/lambda';

const agentCoreService = new AgentCoreService();

/**
 * Invoke AgentCore agent synchronously
 * POST /agentcore/invoke
 */
export const invokeAgent: RequestHandler = async (req, res) => {
  try {
    const { prompt, sessionId } = req.body;

    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    // Get user ID from Cognito claims if available
    let actorId = 'anonymous';
    let bearerToken: string | undefined;

    try {
      const { event } = getCurrentInvoke();
      if (event?.requestContext?.authorizer?.claims?.sub) {
        actorId = event.requestContext.authorizer.claims.sub;
      }
      // Extract bearer token from Authorization header
      const authHeader =
        event?.headers?.Authorization || event?.headers?.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        bearerToken = authHeader.substring(7);
      }
    } catch (error) {
      // Running locally without Lambda context
      console.log('Running without Lambda context, using anonymous user');
      // Try to get bearer token from express request
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        bearerToken = authHeader.substring(7);
      }
    }

    const response = await agentCoreService.invokeAgent(
      {
        prompt,
        sessionId,
        actorId,
      },
      bearerToken
    );

    res.json(response);
  } catch (error) {
    console.error('Error invoking agent:', error);
    res.status(500).json({
      error: 'Failed to invoke agent',
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * Get AgentCore configuration
 * GET /agentcore/config
 */
export const getConfig: RequestHandler = async (req, res) => {
  try {
    const config = agentCoreService.getConfig();
    res.json(config);
  } catch (error) {
    console.error('Error getting config:', error);
    res.status(500).json({
      error: 'Failed to get configuration',
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * Health check endpoint
 * GET /agentcore/health
 */
export const healthCheck: RequestHandler = async (req, res) => {
  try {
    const health = agentCoreService.healthCheck();
    res.json(health);
  } catch (error) {
    console.error('Error in health check:', error);
    res.status(503).json({
      status: 'unhealthy',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
