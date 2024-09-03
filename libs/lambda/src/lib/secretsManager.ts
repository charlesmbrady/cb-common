import { SecretsManagerClient, GetSecretValueCommand, PutSecretValueCommand } from '@aws-sdk/client-secrets-manager';

import { getLogger, getLogStructForError } from './logger';

const secretsManagerClient = new SecretsManagerClient({
  region: 'us-east-1',
});

const secretCache = new Map<string, string>();

const logger = getLogger();

export async function getSecret(secretId: string): Promise<string | null> {
  try {
    logger.info('Getting secret', { secretId });

    const cachedValue = secretCache.get(secretId);
    if (cachedValue) {
      logger.info('Using cached secret', { secretId });
      return cachedValue;
    }

    logger.info('Fetching secret', { secretId });
    const data = await secretsManagerClient.send(
      new GetSecretValueCommand({
        SecretId: secretId,
      })
    );

    if (data.SecretString) {
      secretCache.set(secretId, data.SecretString);
      return data.SecretString;
    }
  } catch (err) {
    logger.error('Failed to get secret', { err: getLogStructForError(err) });
  }

  return null;
}

export async function putSecret(secretId: string, value: string): Promise<boolean> {
  try {
    logger.info('Putting secret', { secretId });
    const data = await secretsManagerClient.send(
      new PutSecretValueCommand({
        SecretId: secretId,
        SecretString: value,
      })
    );

    if (data.$metadata.httpStatusCode === 200) {
      secretCache.set(secretId, value);
      return true;
    }
  } catch (err) {
    logger.error('Failed to put secret', { err: getLogStructForError(err) });
  }

  return false;
}
