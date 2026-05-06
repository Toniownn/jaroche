import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma';
import { env } from '../config/env';
import { signAccessToken, signRefreshToken } from '../utils/jwt';
import { AppError } from '../utils/asyncHandler';

export async function registerUser(input: { name: string; email: string; password: string }) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new AppError(409, 'Email already registered');

  const password = await bcrypt.hash(input.password, env.BCRYPT_ROUNDS);
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password,
      role: 'CUSTOMER',
      cart: { create: {} },
    },
  });

  return user;
}

export async function loginUser(input: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) throw new AppError(401, 'Invalid credentials');

  const ok = await bcrypt.compare(input.password, user.password);
  if (!ok) throw new AppError(401, 'Invalid credentials');

  return user;
}

export function issueTokens(user: { id: string; email: string; role: 'ADMIN' | 'CUSTOMER' }) {
  const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });
  const { token: refreshToken } = signRefreshToken(user.id);
  return { accessToken, refreshToken };
}

export function publicUser(user: {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
}) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}
