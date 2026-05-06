import type { Request, Response } from 'express';
import { registerSchema, loginSchema } from '@jaroche/shared';
import { asyncHandler, AppError } from '../utils/asyncHandler';
import {
  registerUser,
  loginUser,
  issueTokens,
  publicUser,
} from '../services/auth.service';
import { prisma } from '../config/prisma';
import { verifyRefreshToken } from '../utils/jwt';
import { env } from '../config/env';

const REFRESH_COOKIE = 'jaroche_refresh';
const refreshCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: env.NODE_ENV === 'production',
  path: '/api/auth',
  // 7 days
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const data = registerSchema.parse(req.body);
    const user = await registerUser(data);
    const { accessToken, refreshToken } = issueTokens(user);
    res.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOptions);
    res.status(201).json({ accessToken, user: publicUser(user) });
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const data = loginSchema.parse(req.body);
    const user = await loginUser(data);
    const { accessToken, refreshToken } = issueTokens(user);
    res.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOptions);
    res.json({ accessToken, user: publicUser(user) });
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const token = (req.cookies?.[REFRESH_COOKIE] as string | undefined) ?? '';
    if (!token) throw new AppError(401, 'No refresh token');
    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch {
      throw new AppError(401, 'Invalid refresh token');
    }
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) throw new AppError(401, 'User no longer exists');
    const { accessToken, refreshToken } = issueTokens(user);
    res.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOptions);
    res.json({ accessToken, user: publicUser(user) });
  }),

  logout: asyncHandler(async (_req: Request, res: Response) => {
    res.clearCookie(REFRESH_COOKIE, { path: '/api/auth' });
    res.json({ ok: true });
  }),
};
