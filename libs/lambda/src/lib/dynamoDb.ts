import {
  DynamoDBClient,
  QueryCommand,
  PutItemCommand,
  QueryCommandOutput,
  QueryCommandInput,
  AttributeValue,
  BatchWriteItemCommandInput,
  BatchWriteItemCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

import { getLogger, getLogStructForError } from './logger';

const dynamoDbClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

const logger = getLogger();

export async function putItem<T>(tableName: string, item: T): Promise<boolean> {
  try {
    const command = new PutItemCommand({
      TableName: tableName,
      Item: marshall(item, { removeUndefinedValues: true }),
    });

    const response = await dynamoDbClient.send(command);
    logger.info('DynamoDb put item response', { response });
    return true;
  } catch (err) {
    logger.error('Failed to put item', { tableName, item, err: getLogStructForError(err) });
    return false;
  }
}

async function query(commandConfig: QueryCommandInput): Promise<QueryCommandOutput | null> {
  try {
    const command = new QueryCommand(commandConfig);

    const response = await dynamoDbClient.send(command);

    logger.info('DynamoDb query response', { response });
    return response;
  } catch (err) {
    logger.error('Failed to execute query', { err: getLogStructForError(err) });
    return null;
  }
}

export async function queryItems<T>(commandConfig: QueryCommandInput): Promise<T[] | null> {
  try {
    const items: T[] = [];
    let lastEvaluatedKey: Record<string, AttributeValue> | undefined = undefined;
    do {
      const response: QueryCommandOutput | null = await query({
        ...commandConfig,
        ExclusiveStartKey: lastEvaluatedKey,
      });

      if (response?.Items) {
        items.push(...response.Items.map((item) => unmarshall(item) as T));
      }

      if (response?.LastEvaluatedKey) {
        lastEvaluatedKey = response.LastEvaluatedKey;
      } else {
        // reset it in case it paginated already
        lastEvaluatedKey = undefined;
      }
    } while (lastEvaluatedKey);

    return items;
  } catch (err) {
    logger.error('Failed to get items', { err: getLogStructForError(err) });
    return null;
  }
}

// Use "QueryCommand" instead of GetItemCommand because it allows searching by sk instead of pk
export async function queryItem<T>(commandConfig: QueryCommandInput): Promise<T | null> {
  try {
    const response = await queryItems<T>(commandConfig);
    if (response && response[0]) {
      return response[0];
    }

    return null;
  } catch (err) {
    logger.error('Failed to get item', { err: getLogStructForError(err) });
    return null;
  }
}

const MAX_RETRY_DELAY = 10000;
export async function batchWriteItem(commandConfig: BatchWriteItemCommandInput, retryDelay = 0): Promise<boolean> {
  try {
    const response = await dynamoDbClient.send(new BatchWriteItemCommand(commandConfig));

    if (response.UnprocessedItems && Object.keys(response.UnprocessedItems).length > 0) {
      logger.log('DynamoDb batch item response', { response });
      if (retryDelay > MAX_RETRY_DELAY) {
        logger.error('Failed to batch write item after max retries', { commandConfig });
        return false;
      }

      await new Promise((resolve) => setTimeout(resolve, retryDelay));
      // exponential backoff
      return batchWriteItem(commandConfig, retryDelay ? retryDelay * 2 : 500);
    }

    logger.log('DynamoDb batch item response', { response });
    return true;
  } catch (err) {
    logger.error('Failed to batch write item', { commandConfig, err: getLogStructForError(err) });
    return false;
  }
}
