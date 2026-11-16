import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from '../shared/constants';

interface TokenPayload {
  id: string;
  tenantId: string;
  role: string;
}

/**
 * Generate an access JWT (short-lived).
 * Kept compatible with the original boilerplate's `generateAccessJWT(userId)` overload.
 */
export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.SECRET_ACCESS_TOKEN, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
}

/**
 * Convenience overload matching the original boilerplate signature:
 *   generateAccessJWT(userId: string): string
 * Used when only the user ID is available (e.g. email verification redirect).
 */
export function generateAccessJWT(userId: string): string {
  return jwt.sign({ id: userId }, env.SECRET_ACCESS_TOKEN, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.SECRET_REFRESH_TOKEN, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, env.SECRET_ACCESS_TOKEN) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, env.SECRET_REFRESH_TOKEN) as TokenPayload;
}

export interface TempTokenPayload {
  id: string;
  intent: '2fa';
}

export function generateTempToken(userId: string): string {
  return jwt.sign({ id: userId, intent: '2fa' }, env.SECRET_ACCESS_TOKEN, {
    expiresIn: '5m',
  });
}

export function verifyTempToken(token: string): TempTokenPayload {
  const payload = jwt.verify(token, env.SECRET_ACCESS_TOKEN) as any;
  if (payload.intent !== '2fa') {
    throw new Error('Invalid token intent');
  }
  return payload as TempTokenPayload;
}
