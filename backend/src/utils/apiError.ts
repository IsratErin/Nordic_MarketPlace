export class ApiError extends Error {
  statusCode: number;
  meta?: any;

  constructor(statusCode: number, message: string, meta?: any) {
    super(message);
    this.statusCode = statusCode;
    this.meta = meta;
    this.name = 'ApiError';
  }

  static badRequest(message = 'Bad request', meta?: any) {
    return new ApiError(400, message, meta);
  }

  static unauthorized(message = 'Unauthorized', meta?: any) {
    return new ApiError(401, message, meta);
  }

  static forbidden(message = 'Forbidden', meta?: any) {
    return new ApiError(403, message, meta);
  }

  static notFound(message = 'Not found', meta?: any) {
    return new ApiError(404, message, meta);
  }

  static internal(message = 'Internal server error', meta?: any) {
    return new ApiError(500, message, meta);
  }
}
