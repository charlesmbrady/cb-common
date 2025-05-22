// write afunction for creating a scenario for a user in dynamodb

import { putItem } from '@cb-common/lambda';
import { Scenario } from '@cb-common/mockdat-svc';
import { queryItems } from '@cb-common/lambda';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { deleteItem } from '@cb-common/lambda';
import { config } from '../../config';
const { ENVIRONMENT } = config;

const MOCKDAT_TABLE_NAME = `mockdat-${ENVIRONMENT}`;
export type ScenarioDbItem = {
  id: string;
  name: string;
  type: string;
  [key: string]: any;
};

export const createScenario = async (userId: string, scenario: Scenario) => {
  const { id, name, description } = scenario;

  const item = {
    pk: `user#${userId}`,
    sk: `scenario#${id}`,
    userId,
    id,
    name,
    description:
      description !== undefined ? description : JSON.stringify(scenario),
    type: scenario.type,
    data: scenario.data,
    status: scenario.status,
  };
  const result = await putItem(MOCKDAT_TABLE_NAME, item);
  return result;
};

export const getUserScenarios = async (
  userId: string
): Promise<ScenarioDbItem[]> => {
  const pk = `user#${userId}`;
  const result = await queryItems({
    tableName: MOCKDAT_TABLE_NAME,
    keyConditionExpression: 'pk = :pk',
    expressionAttributeValues: { ':pk': { S: pk } },
  });

  return (result || []).map((item: any) => {
    const unmarshalled = unmarshall(item);
    return {
      id: unmarshalled.id,
      name: unmarshalled.name,
      type: unmarshalled.type || unmarshalled.objectType,
      ...unmarshalled,
    };
  });
};

export const deleteScenario = async (userId: string, scenarioId: string) => {
  const pk = `user#${userId}`;
  const sk = `scenario#${scenarioId}`;
  return deleteItem({
    tableName: MOCKDAT_TABLE_NAME,
    key: {
      pk: { S: pk },
      sk: { S: sk },
    },
  });
};
