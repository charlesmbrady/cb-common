import { Router } from 'express';
import {
  invokeAgent,
  getConfig,
  healthCheck,
} from '../controllers/agentcore.controller';

const router = Router();

// Invoke agent endpoint
router.post('/invoke', invokeAgent);

// Configuration endpoint
router.get('/config', getConfig);

// Health check
router.get('/health', healthCheck);

export default router;
