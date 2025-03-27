import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { logger } from '../logger';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const COOKIE_NAME = process.env.COOKIE_NAME || 'next_auth_token';

export interface UserPayload {
  id: string;
  email: string;
}

export const createToken = (user: UserPayload): string => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '1d' });
};

export const verifyToken = (token: string): UserPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch (error) {
    logger.error('Error verifying JWT token:', error);
    return null;
  }
};

export const getAuthToken = (): string | null => {
  const cookieStore = cookies();
  return cookieStore.get(COOKIE_NAME)?.value || null;
};

export const getCurrentUser = (): UserPayload | null => {
  const token = getAuthToken();
  if (!token) return null;
  return verifyToken(token);
};

export const setAuthCookie = (token: string): void => {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 1 day
  });
};

export const removeAuthCookie = (): void => {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
}; 