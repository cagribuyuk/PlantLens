import { Router } from 'express';

import {
  identifyPlantController,
} from '../controllers/plant.controller';

const router =
  Router();

router.post(
  '/identify',
  identifyPlantController,
);

export default router;