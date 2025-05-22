import { Request, Response, RequestHandler } from 'express';
import { processScenarioData } from '../services/mockdat/data.service';
import { objectTypes, fields, Scenario } from '@cb-common/mockdat-svc';
import { getCurrentInvoke } from '@cb-common/lambda';
import {
  createScenario,
  getUserScenarios,
  deleteScenario,
} from '../services/mockdat/scenario.service';

// Mapping of record types to their valid fields
const recordTypeFields: Record<string, string[]> = {
  Account: [
    'Account Name',
    'City',
    'State',
    'Street',
    'Phone Number',
    'Email',
    'Title',
    'Lead Source',
    'Lead Status',
  ],
  Contact: [
    'First Name',
    'Last Name',
    'Email',
    'Phone Number',
    'Title',
    'City',
    'State',
    'Street',
    'Lead Source',
    'Lead Status',
  ],
  Lead: [
    'First Name',
    'Last Name',
    'Email',
    'Phone Number',
    'Title',
    'City',
    'State',
    'Street',
    'Lead Source',
    'Lead Status',
    'Amount',
  ],
  Opportunity: [
    'Opportunity Stage',
    'Close Date',
    'Amount',
    'Probability',
    'Forecast Category',
    'Account Name',
    'City',
    'State',
  ],
  Generic: fields,
};

export const getScenarioData: RequestHandler = (req, res) => {
  res.json({
    status: 'ok',
    message: 'getting stored scenario data coming soon',
  });
};
export const getAllObjectTypes: RequestHandler = (req, res) => {
  const event = getCurrentInvoke();
  console.log('event', event);
  res.json({
    status: 'ok',
    message: 'success',
    data: objectTypes,
  });
};
export const getAllFields: RequestHandler = (req, res) => {
  const { type } = req.query;
  let resultFields = fields;
  if (type && typeof type === 'string' && recordTypeFields[type]) {
    resultFields = recordTypeFields[type];
  }
  res.json({
    status: 'ok',
    message: 'success',
    data: resultFields,
  });
};

export const processScenario: RequestHandler = (req, res) => {
  const data = req.body;
  console.log('Received request to process scenario:', data);

  const processedData = processScenarioData(data);

  res.status(201).json({
    message: 'Processing capability comming soon.',
    data: processedData,
  });
};

export const createScenarioController: RequestHandler = async (req, res) => {
  try {
    console.log('createScenarioController');
    const { event } = getCurrentInvoke();
    const data: Scenario = req.body;
    console.log('Received request to create scenario:', data);
    const environmentTag = process.env.ENVIRONMENT_TAG || 'Test';
    // Patch the table name in the service if needed
    const result = await createScenario(
      event.requestContext.authorizer.claims.sub,
      data,
      environmentTag
    );
    res.status(201).json({
      message: 'Scenario created successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error creating scenario:', error);
    res.status(500).json({
      message: 'Failed to create scenario',
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const getUserScenariosController: RequestHandler = async (req, res) => {
  try {
    const { event } = getCurrentInvoke();
    const environmentTag = process.env.ENVIRONMENT_TAG || 'Test';
    const userId = event.requestContext.authorizer.claims.sub;
    const scenarios = await getUserScenarios(userId, environmentTag);
    res.status(200).json({
      message: 'User scenarios fetched successfully',
      data: scenarios,
    });
  } catch (error) {
    console.error('Error fetching user scenarios:', error);
    res.status(500).json({
      message: 'Failed to fetch user scenarios',
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const deleteScenarioController: RequestHandler = async (req, res) => {
  try {
    const { event } = getCurrentInvoke();
    const environmentTag = process.env.ENVIRONMENT_TAG || 'Test';
    const userId = event.requestContext.authorizer.claims.sub;
    const scenarioId = req.params.id;
    await deleteScenario(userId, scenarioId, environmentTag);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting scenario:', error);
    res.status(500).json({
      message: 'Failed to delete scenario',
      error: error instanceof Error ? error.message : error,
    });
  }
};
