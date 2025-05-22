import { getCurrentInvoke } from '@cb-common/lambda';
import { Request, Response } from 'express';

export const getInfo = (req: Request, res: Response) => {
  const event = getCurrentInvoke();
  console.log('event', event);
  res.json({
    service: 'API Services',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
};

export const postData = (req: Request, res: Response) => {
  const data = req.body;
  console.log('Received data:', data);

  res.status(201).json({
    message: 'Data received successfully',
    data,
  });
};
