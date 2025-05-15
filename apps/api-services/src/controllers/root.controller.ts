import { Request, Response } from 'express';

export const getRoot = (req: Request, res: Response) => {
  res.json({ message: 'Hello from Express on Lambda!!' });
};
