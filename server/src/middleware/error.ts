import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { AppError } from '../utils/asyncHandler';

export const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'ValidationError',
      details: err.flatten().fieldErrors,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.status).json({
      error: err.name,
      message: err.message,
      details: err.details,
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({
        error: 'Conflict',
        message: 'A record with this value already exists.',
      });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'NotFound', message: 'Resource not found.' });
    }
  }

  console.error('[error]', err);
  res.status(500).json({ error: 'InternalServerError', message: 'Something went wrong.' });
};
