import 'dotenv/config';

import express from 'express';
import cors from 'cors';

import plantRoutes from './routes/plant.routes';

import {
  errorHandler,
} from './middleware/errorHandler';

import {
  requestLogger,
} from './middleware/requestLogger';

import {
  logger,
} from './config/logger';

const app =
  express();

const port =
  Number(
    process.env.PORT,
  ) || 3000;

app.use(
  requestLogger,
);

app.use(
  cors({
    origin: true,
  }),
);

app.use(
  express.json({
    limit: '15mb',
  }),
);

app.get(
  '/health',
  (_req, res) => {
    res
      .status(200)
      .json({
        status: 'ok',
        service:
          'PlantLens API',
      });
  },
);

app.use(
  '/api/plants',
  plantRoutes,
);

app.use(
  errorHandler,
);

app.listen(
  port,
  '0.0.0.0',
  () => {
    logger.info(
      {
        port,
      },
      'PlantLens API started',
    );
  },
);