import { Request, Response, RequestHandler } from 'express';
import { processScenarioData } from '../services/mockdat/data.service';
import { objectTypes, fields } from '@cb-common/mockdat-svc';

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
