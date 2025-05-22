import { Router } from 'express';
import {
  getScenarioData,
  getAllObjectTypes,
  getAllFields,
  processScenario,
  createScenarioController,
  getUserScenariosController,
  deleteScenarioController,
} from '../controllers/mockdat.controller';

const router = Router();

router.get('/scenarios', getUserScenariosController);
router.get('/data/objects', getAllObjectTypes);
router.get('/data/object-types', getAllObjectTypes);
router.get('/data/fields', getAllFields);
router.post('/data', processScenario);
router.post('/scenario', createScenarioController);
router.delete('/scenarios/:id', deleteScenarioController);
export default router;
