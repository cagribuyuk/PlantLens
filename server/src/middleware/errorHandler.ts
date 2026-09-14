import {
  NextFunction,
  Request,
  Response,
} from 'express';

import {
  AppError,
} from '../errors/AppError';

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (
    error instanceof AppError
  ) {
    req.log.warn(
      {
        requestId:
          req.id,

        code:
          error.code,

        statusCode:
          error.statusCode,

        error:
          error.message,
      },
      'Application error',
    );

    return res
      .status(
        error.statusCode,
      )
      .json({
        code:
          error.code,

        message:
          error.message,

        requestId:
          req.id,
      });
  }

  req.log.error(
    {
      requestId:
        req.id,

      error,
    },
    'Unhandled server error',
  );

  return res
    .status(500)
    .json({
      code:
        'INTERNAL_SERVER_ERROR',

      message:
        'An unexpected server error occurred.',

      requestId:
        req.id,
    });
}