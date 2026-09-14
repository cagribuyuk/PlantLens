import {
  IdentifyPlantRequest,
  PlantNetResponse,
} from '../types/plant';

import { AppError } from '../errors/AppError';

const API_URL =
  process.env.EXPO_PUBLIC_API_URL;

interface BackendErrorResponse {
  code?: string;
  message?: string;
}

interface IdentifyBackendRequest {
  imageBase64: string;
  fileName: string;
  mimeType: string;
  organ: string;
}

export async function identifyPlant(
  request: IdentifyPlantRequest,
): Promise<PlantNetResponse> {
  if (!API_URL) {
    throw new AppError(
      'API_ERROR',
      'PlantLens API URL is not configured.',
    );
  }

  if (!request.image?.base64) {
    throw new AppError(
      'INVALID_IMAGE',
      'The selected image could not be processed.',
    );
  }

  const payload: IdentifyBackendRequest = {
    imageBase64:
      request.image.base64,

    fileName:
      request.image.fileName ??
      `plant-${Date.now()}.jpg`,

    mimeType:
      request.image.mimeType ??
      'image/jpeg',

    organ:
      request.organ,
  };

  console.log(
    '[IDENTIFY REQUEST]',
    {
      url:
        `${API_URL}/api/plants/identify`,

      fileName:
        payload.fileName,

      mimeType:
        payload.mimeType,

      organ:
        payload.organ,

      base64Length:
        payload.imageBase64.length,
    },
  );

  try {
    const response =
      await fetch(
        `${API_URL}/api/plants/identify`,
        {
          method: 'POST',

          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(
            payload,
          ),
        },
      );

    const responseText =
      await response.text();

    let responseData:
      | PlantNetResponse
      | BackendErrorResponse;

    try {
      responseData =
        responseText
          ? JSON.parse(responseText)
          : {};
    } catch {
      throw new AppError(
        'API_ERROR',
        'The server returned an invalid response.',
        response.status,
      );
    }

    console.log(
      '[IDENTIFY RESPONSE]',
      {
        status:
          response.status,

        ok:
          response.ok,
      },
    );

    if (!response.ok) {
      throw mapBackendError(
        response.status,
        responseData as BackendErrorResponse,
      );
    }

    const result =
      responseData as PlantNetResponse;

    if (
      !result.results?.length
    ) {
      throw new AppError(
        'NO_RESULT',
        'We could not confidently identify this plant.',
        response.status,
      );
    }

    console.log(
      '[IDENTIFY SUCCESS]',
      {
        bestMatch:
          result.bestMatch,

        resultCount:
          result.results.length,
      },
    );

    return result;
  } catch (error) {
    if (
      error instanceof AppError
    ) {
      throw error;
    }

    console.error(
      '[IDENTIFY NETWORK ERROR]',
      error,
    );

    throw new AppError(
      'NETWORK_ERROR',
      'Unable to connect to PlantLens. Please try again.',
      undefined,
      error,
    );
  }
}

function mapBackendError(
  status: number,
  data: BackendErrorResponse,
): AppError {
  switch (data.code) {
    case 'IMAGE_REQUIRED':
    case 'INVALID_IMAGE_TYPE':
    case 'IMAGE_TOO_LARGE':
      return new AppError(
        'INVALID_IMAGE',
        data.message ??
          'Please select a valid plant image.',
        status,
      );

    case 'NO_RESULT':
      return new AppError(
        'NO_RESULT',
        data.message ??
          'No matching plant could be found.',
        status,
      );

    case 'PLANTNET_RATE_LIMIT':
      return new AppError(
        'RATE_LIMIT',
        data.message ??
          'Too many identification requests. Please try again later.',
        status,
      );

    case 'PLANTNET_TIMEOUT':
      return new AppError(
        'TIMEOUT',
        data.message ??
          'Plant identification took too long.',
        status,
      );

    default:
      if (status >= 500) {
        return new AppError(
          'API_ERROR',
          data.message ??
            'The identification service is temporarily unavailable.',
          status,
        );
      }

      return new AppError(
        'BAD_REQUEST',
        data.message ??
          'The plant image could not be processed.',
        status,
      );
  }
}