import type { PublicUser } from './user';

export interface LoginResponse {
  accessToken: string;
  user: PublicUser;
}

export interface JwtAccessPayload {
  sub: string;
  role: 'ADMIN' | 'CUSTOMER';
  email: string;
}

export interface JwtRefreshPayload {
  sub: string;
  jti: string;
}
