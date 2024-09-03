import { APIGatewayProxyResult } from 'aws-lambda';

export function createApiGatewayResponse(statusCode: number, data: Record<string, unknown>): APIGatewayProxyResult {
  return {
    statusCode,
    headers: {
      // Note: these don't work with lambda function url cors
      // AWS adds duplicate headers in that situation
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    },
    body: JSON.stringify(data),
  };
}
