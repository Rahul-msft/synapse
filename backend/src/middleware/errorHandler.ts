import { Request, Response, NextFunction } from 'express';
import { createApiResponse, ERROR_CODES } from '@synapse/shared';

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
}

export function errorHandler(
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const errorCode = err.code || ERROR_CODES.INTERNAL_ERROR;
  const message = err.message || 'Internal server error';

  const response = createApiResponse(false, undefined, {
    code: errorCode,
    message,
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  res.status(statusCode).json(response);
}