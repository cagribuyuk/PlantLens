import {
  NextFunction,
  Request,
  Response,
} from 'express';

import { AppError } from '../errors/AppError';

import {
  identifyPlantSchema,
} from '../schemas/plant.schema';

import {
  identifyPlant,
} from '../services/plantNet.service';

export async function identifyPlantController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsed =
      identifyPlantSchema.safeParse(
        req.body,
      );

    if (!parsed.success) {
      throw new AppError(
        400,
        parsed.error.issues[0]
          ?.message ??
          'Invalid request.',
        'VALIDATION_ERROR',
      );
    }

    const {
      imageBase64,
      fileName,
      mimeType,
      organ,
    } = parsed.data;

    const imageBuffer =
      Buffer.from(
        imageBase64,
        'base64',
      );

    if (
      imageBuffer.length === 0
    ) {
      throw new AppError(
        400,
        'Invalid image data.',
        'INVALID_IMAGE',
      );
    }

    const maxSize =
      10 * 1024 * 1024;

    if (
      imageBuffer.length >
      maxSize
    ) {
      throw new AppError(
        400,
        'The image is too large. Maximum size is 10 MB.',
        'IMAGE_TOO_LARGE',
      );
    }

    req.log.info(
      {
        fileName,
        mimeType,
        organ,
        imageSize:
          imageBuffer.length,
      },
      'Plant identification requested',
    );

    const result =
      await identifyPlant({
        buffer:
          imageBuffer,

        fileName,
        mimeType,
        organ,
      });

    return res
      .status(200)
      .json(result);
  } catch (error) {
    next(error);
  }
}