export type AppErrorCode =
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'UNAUTHORIZED'
  | 'RATE_LIMIT'
  | 'BAD_REQUEST'
  | 'NO_RESULT'
  | 'API_ERROR'
  | 'CAMERA_PERMISSION'
  | 'INVALID_IMAGE'
  | 'WEB_NOT_SUPPORTED'
  | 'UNKNOWN';

export class AppError extends Error {
  constructor(
    public code: AppErrorCode,
    message: string,
    public statusCode?: number,
    public originalError?: unknown,
  ) {
    super(message);

    this.name = 'AppError';
  }
}