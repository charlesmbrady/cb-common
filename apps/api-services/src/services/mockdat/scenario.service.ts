// write afunction for creating a scenario for a user in dynamodb

import { putItem } from '@cb-common/lambda';
import { Scenario } from '@cb-common/mockdat-svc';
import { queryItems } from '@cb-common/lambda';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { deleteItem } from '@cb-common/lambda';

export type ScenarioDbItem = {
  id: string;
  name: string;
  type: string;
  [key: string]: any;
};

// It should take in the userId as parameter as well as the scenario definition
export const createScenario = async (
  userId: string,
  scenario: Scenario,
  environmentTag: string
) => {
  const { id, name, description } = scenario;

  const TABLE_NAME = `mockdat-${environmentTag}`;
  // add to dynamodb
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
  const result = await putItem(TABLE_NAME, item);
  return result;
};

// Need function for getting a scenario by id from dynamodb

// Need function for getting all scenarios (community) from dynamodb
// Need function for getting all scenarios by user id from dynamodb

// Need function for updating a scenario by id

// Need function for deleting a scenario by id

export const getUserScenarios = async (
  userId: string,
  environmentTag: string
): Promise<ScenarioDbItem[]> => {
  const TABLE_NAME = `mockdat-${environmentTag}`;
  const pk = `user#${userId}`;
  const result = await queryItems({
    tableName: TABLE_NAME,
    keyConditionExpression: 'pk = :pk',
    expressionAttributeValues: { ':pk': { S: pk } },
  });
  // Unmarshall all items and return as plain objects
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

export const deleteScenario = async (
  userId: string,
  scenarioId: string,
  environmentTag: string
) => {
  const TABLE_NAME = `mockdat-${environmentTag}`;
  const pk = `user#${userId}`;
  const sk = `scenario#${scenarioId}`;
  return deleteItem({
    tableName: TABLE_NAME,
    key: {
      pk: { S: pk },
      sk: { S: sk },
    },
  });
};
