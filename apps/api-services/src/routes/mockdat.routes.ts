import { Router } from 'express';
import {
  getScenarioData,
  getAllObjectTypes,
  getAllFields,
  processScenario,
} from '../controllers/mockdat.controller';

const router = Router();

router.get('/scenarios', getScenarioData);
router.get('/data/objects', getAllObjectTypes);
router.get('/data/fields', getAllFields);
router.post('/data', processScenario);

export default router;
