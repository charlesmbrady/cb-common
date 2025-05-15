import { Router } from 'express';
import { getInfo, postData } from '../controllers/api.controller';

const router = Router();

router.get('/info', getInfo);
router.post('/data', postData);

export default router;
