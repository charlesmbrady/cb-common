import { Request, Response } from 'express';
import {
  fields,
  objectTypes,
  processScenarioData,
} from '../services/mockdat/data.service';

export const getScenarioData = (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'getting stored scenario data coming soon',
  });
};
export const getAllObjectTypes = (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'success',
    data: objectTypes,
  });
};
export const getAllFields = (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'success',
    data: fields,
  });
};

export const processScenario = (req: Request, res: Response) => {
  const data = req.body;
  console.log('Received request to process scenario:', data);

  const processedData = processScenarioData(data);

  res.status(201).json({
    message: 'Processing capability comming soon.',
    data: processedData,
  });
};
