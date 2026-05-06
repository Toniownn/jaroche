import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { AppError } from '../utils/asyncHandler';
import type { JwtAccessPayload } from '@jaroche/shared';

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtAccessPayload;
  }
}

export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(new AppError(401, 'Missing access token'));
  }
  const token = header.slice('Bearer '.length).trim();
  try {
    req.user = verifyAccessToken(token);
    return next();
  } catch {
    return next(new AppError(401, 'Invalid or expired access token'));
  }
};

export function requireRole(role: 'ADMIN' | 'CUSTOMER'): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError(401, 'Unauthenticated'));
    if (req.user.role !== role) return next(new AppError(403, 'Forbidden'));
    return next();
  };
}
