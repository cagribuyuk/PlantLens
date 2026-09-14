import { z } from 'zod';

export const identifyPlantSchema =
  z.object({
    imageBase64:
      z
        .string()
        .min(
          1,
          'Plant image is required.',
        ),

    fileName:
      z
        .string()
        .min(1)
        .max(255),

    mimeType:
      z.enum([
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
      ]),

    organ:
      z.enum([
        'auto',
        'leaf',
        'flower',
        'fruit',
        'bark',
      ]),
  });

export type IdentifyPlantBody =
  z.infer<
    typeof identifyPlantSchema
  >;