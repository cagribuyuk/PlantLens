import {
  randomUUID,
} from 'crypto';

import pinoHttp from 'pino-http';

import {
  logger,
} from '../config/logger';

export const requestLogger =
  pinoHttp({
    logger,

    genReqId: (
      req,
      res,
    ) => {
      const existingId =
        req.headers[
          'x-request-id'
        ];

      const requestId =
        typeof existingId ===
        'string'
          ? existingId
          : randomUUID();

      res.setHeader(
        'x-request-id',
        requestId,
      );

      return requestId;
    },

    customProps: req => ({
      requestId: req.id,
    }),

    customLogLevel: (
      _req,
      res,
      error,
    ) => {
      if (
        error ||
        res.statusCode >= 500
      ) {
        return 'error';
      }

      if (
        res.statusCode >= 400
      ) {
        return 'warn';
      }

      return 'info';
    },
  });