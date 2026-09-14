import { AppError } from '../errors/AppError';

interface IdentifyPlantInput {
  buffer: Buffer;
  fileName: string;
  mimeType: string;
  organ: string;
}

export async function identifyPlant({
  buffer,
  fileName,
  mimeType,
  organ,
}: IdentifyPlantInput) {
  const apiKey =
    process.env.PLANTNET_API_KEY;

  if (!apiKey) {
    console.error(
      '[PLANTNET CONFIG]',
      'PLANTNET_API_KEY is missing',
    );

    throw new AppError(
      500,
      'Plant identification service is not configured.',
      'PLANTNET_CONFIG_ERROR',
    );
  }

  try {
    const formData =
      new FormData();

    const bytes =
      new Uint8Array(buffer);

    const imageBlob =
      new Blob(
        [bytes],
        {
          type: mimeType,
        },
      );

    formData.append(
      'images',
      imageBlob,
      fileName,
    );

    formData.append(
      'organs',
      organ || 'auto',
    );

    const url =
      new URL(
        'https://my-api.plantnet.org/v2/identify/all',
      );

    url.searchParams.set(
      'api-key',
      apiKey,
    );

    url.searchParams.set(
      'lang',
      'en',
    );

    url.searchParams.set(
      'nb-results',
      '4',
    );

    console.log(
      '[PLANTNET REQUEST]',
      {
        fileName,
        mimeType,
        organ,
        size: buffer.length,
        apiKeyExists: true,
      },
    );

    const response =
      await fetch(
        url,
        {
          method: 'POST',

          body: formData,

          signal:
            AbortSignal.timeout(
              30_000,
            ),
        },
      );

    const rawResponse =
      await response.text();

    console.log(
      '[PLANTNET RAW RESPONSE]',
      {
        status:
          response.status,

        ok:
          response.ok,

        body:
          rawResponse.substring(
            0,
            1000,
          ),
      },
    );

    let data: any;

    try {
      data =
        rawResponse
          ? JSON.parse(
              rawResponse,
            )
          : {};
    } catch {
      throw new AppError(
        502,
        'PlantNet returned an invalid response.',
        'PLANTNET_INVALID_RESPONSE',
      );
    }

    if (!response.ok) {
      if (
        response.status === 400
      ) {
        throw new AppError(
          400,
          data?.message ??
            'PlantNet could not process this image.',
          'PLANTNET_BAD_REQUEST',
        );
      }

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        throw new AppError(
          502,
          'Plant identification authentication failed.',
          'PLANTNET_AUTH_ERROR',
        );
      }

      if (
        response.status === 429
      ) {
        throw new AppError(
          429,
          'Plant identification request limit reached.',
          'PLANTNET_RATE_LIMIT',
        );
      }

      throw new AppError(
        502,
        data?.message ??
          'Plant identification service is unavailable.',
        'PLANTNET_ERROR',
      );
    }

    if (
      !data?.results ||
      data.results.length === 0
    ) {
      throw new AppError(
        404,
        'No plant match was found.',
        'NO_RESULT',
      );
    }

    console.log(
      '[PLANTNET SUCCESS]',
      {
        bestMatch:
          data.bestMatch,

        resultCount:
          data.results.length,
      },
    );

    return data;
  } catch (error) {
    if (
      error instanceof AppError
    ) {
      throw error;
    }

    console.error(
      '[PLANTNET UNEXPECTED ERROR]',
      error,
    );

    if (
      error instanceof Error &&
      (
        error.name ===
          'TimeoutError' ||
        error.name ===
          'AbortError'
      )
    ) {
      throw new AppError(
        504,
        'Plant identification timed out.',
        'PLANTNET_TIMEOUT',
      );
    }

    throw new AppError(
      502,
      'Unable to communicate with the plant identification service.',
      'PLANTNET_NETWORK_ERROR',
    );
  }
}