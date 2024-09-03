import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

import { getLogger, getLogStructForError } from './logger';

const ssmClient = new SSMClient({
  region: 'us-east-1',
});

// might need extra work for StringList or SecureString types
const parameterCache = new Map<string, string>();

const logger = getLogger();

// might need extra work for StringList or SecureString types
export async function getParameter(parameterName: string): Promise<string | null> {
  try {
    logger.info('Getting parameter', { parameterName });

    const cachedValue = parameterCache.get(parameterName);
    if (cachedValue) {
      logger.info('Using cached parameter', { parameterName });
      return cachedValue;
    }

    logger.info('Fetching parameter', { parameterName });
    const data = await ssmClient.send(
      new GetParameterCommand({
        Name: parameterName,
      })
    );

    if (data.Parameter?.Value) {
      parameterCache.set(parameterName, data.Parameter.Value);
      return data.Parameter.Value;
    }
  } catch (err) {
    logger.error('Failed to get parameter', { err: getLogStructForError(err) });
  }

  return null;
}
