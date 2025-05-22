import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  QueryCommand,
  AttributeValue,
} from '@aws-sdk/client-dynamodb';
import { logger } from './logger';

const client = new DynamoDBClient({});

export async function createItem(params: {
  tableName: string;
  item: Record<string, AttributeValue>;
}) {
  try {
    logger.info('Creating item in DynamoDB', {
      tableName: params.tableName,
      item: params.item,
    });
    const command = new PutItemCommand({
      TableName: params.tableName,
      Item: params.item,
    });
    const result = await client.send(command);
    logger.info('Item created successfully', {
      tableName: params.tableName,
      result,
    });
    return result;
  } catch (error) {
    logger.error('Error creating item in DynamoDB', error as Error, {
      tableName: params.tableName,
      item: params.item,
    });
    throw error;
  }
}

export async function getItem(params: {
  tableName: string;
  key: Record<string, AttributeValue>;
}) {
  try {
    logger.info('Getting item from DynamoDB', {
      tableName: params.tableName,
      key: params.key,
    });
    const command = new GetItemCommand({
      TableName: params.tableName,
      Key: params.key,
    });
    const result = await client.send(command);
    logger.info('Item retrieved successfully', {
      tableName: params.tableName,
      result,
    });
    return result.Item;
  } catch (error) {
    logger.error('Error getting item from DynamoDB', error as Error, {
      tableName: params.tableName,
      key: params.key,
    });
    throw error;
  }
}

export async function updateItem(params: {
  tableName: string;
  key: Record<string, AttributeValue>;
  updateExpression: string;
  expressionAttributeValues: Record<string, AttributeValue>;
}) {
  try {
    logger.info('Updating item in DynamoDB', {
      tableName: params.tableName,
      key: params.key,
      updateExpression: params.updateExpression,
      expressionAttributeValues: params.expressionAttributeValues,
    });
    const command = new UpdateItemCommand({
      TableName: params.tableName,
      Key: params.key,
      UpdateExpression: params.updateExpression,
      ExpressionAttributeValues: params.expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    });
    const result = await client.send(command);
    logger.info('Item updated successfully', {
      tableName: params.tableName,
      result,
    });
    return result.Attributes;
  } catch (error) {
    logger.error('Error updating item in DynamoDB', error as Error, {
      tableName: params.tableName,
      key: params.key,
    });
    throw error;
  }
}

export async function deleteItem(params: {
  tableName: string;
  key: Record<string, AttributeValue>;
}) {
  try {
    logger.info('Deleting item from DynamoDB', {
      tableName: params.tableName,
      key: params.key,
    });
    const command = new DeleteItemCommand({
      TableName: params.tableName,
      Key: params.key,
    });
    const result = await client.send(command);
    logger.info('Item deleted successfully', {
      tableName: params.tableName,
      result,
    });
    return result;
  } catch (error) {
    logger.error('Error deleting item from DynamoDB', error as Error, {
      tableName: params.tableName,
      key: params.key,
    });
    throw error;
  }
}

export async function queryItems(params: {
  tableName: string;
  indexName?: string;
  keyConditionExpression: string;
  expressionAttributeValues: Record<string, AttributeValue>;
}) {
  try {
    logger.info('Querying items from DynamoDB', {
      tableName: params.tableName,
      indexName: params.indexName,
      keyConditionExpression: params.keyConditionExpression,
      expressionAttributeValues: params.expressionAttributeValues,
    });
    const command = new QueryCommand({
      TableName: params.tableName,
      IndexName: params.indexName,
      KeyConditionExpression: params.keyConditionExpression,
      ExpressionAttributeValues: params.expressionAttributeValues,
    });
    const result = await client.send(command);
    logger.info('Items queried successfully', {
      tableName: params.tableName,
      count: result.Count,
    });
    return result.Items;
  } catch (error) {
    logger.error('Error querying items from DynamoDB', error as Error, {
      tableName: params.tableName,
      keyConditionExpression: params.keyConditionExpression,
    });
    throw error;
  }
}
