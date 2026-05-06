export type Role = 'ADMIN' | 'CUSTOMER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  _count?: { orders: number };
  lifetimeSpend?: number;
  lastOrderAt?: string | null;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}
