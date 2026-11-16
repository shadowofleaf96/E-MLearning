import { Request, Response, NextFunction } from 'express';
import { verify, JwtPayload } from 'jsonwebtoken';
import prisma from '../shared/database/prisma';
import { AppError } from '../shared/errors/AppError';
import { env } from '../config/env';

interface DecodedToken extends JwtPayload {
  id: string;
  tenantId: string;
  role: string;
}

/**
 * JWT authentication middleware.
 * Verifies the Bearer token, checks blacklist, and attaches user to request.
 */
export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw AppError.unauthorized('Authorization header missing or malformed');
    }

    const token = authHeader.split(' ')[1];

    if (!token || token === 'null' || token === 'undefined') {
      throw AppError.unauthorized('Token missing or malformed');
    }

    // Check if token is blacklisted
    const blacklistedToken = await prisma.blacklist.findUnique({
      where: { token },
    });

    if (blacklistedToken) {
      throw AppError.unauthorized('Token has been revoked');
    }

    const decoded = verify(token, env.SECRET_ACCESS_TOKEN) as DecodedToken;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw AppError.unauthorized('User not found');
    }

    if (user.status !== 'active') {
      throw AppError.forbidden('Account is not active');
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Optional JWT authentication middleware.
 * Attaches user to request if valid Bearer token exists, otherwise proceeds without error.
 */
export async function optionalAuthenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    if (!token || token === 'null' || token === 'undefined') {
      return next();
    }

    const blacklistedToken = await prisma.blacklist.findUnique({
      where: { token },
    });
    if (blacklistedToken) {
      return next();
    }

    try {
      const decoded = verify(token, env.SECRET_ACCESS_TOKEN) as DecodedToken;
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (user && user.status === 'active') {
        req.user = user;
      }
    } catch {
      // Ignore token verification errors for optional auth
    }

    next();
  } catch (err) {
    next(err);
  }
}
