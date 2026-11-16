import axios from 'axios';
import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import prisma from '../../shared/database/prisma';
import {
  generateAccessJWT,
  generateTempToken,
  verifyTempToken,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../../utils/jwt';
import { generateSecret, verify, generateURI } from 'otplib';
import QRCode from 'qrcode';
import { sendEmail } from '../../utils/email';
import { generateUniqueUsername } from '../../utils/generateUsername';
import { getPublicUrl } from '../../utils/fileUtils';
import {
  getWelcomeEmailTemplate,
  getVerificationEmailTemplate,
  getPasswordResetTemplate,
  getLoginAlertTemplate,
  passwordChangedTemplate,
  accountVerifiedTemplate,
} from '../../utils/emailTemplates';
import { env } from '../../config/env';

const client = new OAuth2Client(env.GOOGLE_CLIENT_ID || '');
const BACKEND_URL = process.env.BACKEND_URL;
const FRONTEND_URL = env.FRONTEND_URL;
const LOGO_URL = process.env.LOGO_URL;
const secretKey = env.RECAPTCHA_SECRET_KEY;

/**
 * Auth Controller
 * Authentication & authorization (login, register, OAuth, password reset, token refresh)
 * Restored from the original boilerplate userController.ts and adapted to the modular structure.
 */

/** Register a new user (public registration with reCAPTCHA) */
export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password, firstName, lastName, recaptchaToken, tenantId } =
      req.body;

    // reCAPTCHA verification
    if (
      secretKey &&
      process.env.NODE_ENV !== 'test' &&
      recaptchaToken !== 'mock-token'
    ) {
      const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;
      const response = await axios.post(verificationURL);
      const { success, score } = response.data as {
        success: boolean;
        score: number;
      };

      if (!success || score < 0.5) {
        res.status(403).json({ message: 'reCAPTCHA verification failed.' });
        return;
      }
    }

    // Check existing user
    const existingUser = await prisma.user.findFirst({
      where: { email, tenantId },
    });
    if (existingUser) {
      res.status(400).json({
        status: 'failed',
        message: 'It seems you already have an account. Please log in.',
      });
      return;
    }

    let avatarUrl = null;
    if (req.file) {
      avatarUrl = getPublicUrl(req.file.path);
    }

    const emailToken = crypto.randomBytes(64).toString('hex');
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        authProvider: 'local',
        email,
        firstName,
        lastName,
        password: hashedPassword,
        avatar: avatarUrl,
        role: 'student',
        status: 'active',
        emailToken,
        isVerified: false,
        tenantId,
      },
    });

    const verifyLink = `${BACKEND_URL}/api/auth/verify-email/${emailToken}`;

    sendEmail({
      to: newUser.email,
      subject: 'E-Tactiques - Verify your email',
      html: getVerificationEmailTemplate({
        logoUrl: LOGO_URL,
        action: {
          url: verifyLink,
          text: 'Verify Email',
        },
      }),
    }).catch((err) => console.warn('Failed to send verification email:', err));

    res.status(201).json({
      status: 'success',
      message:
        'Registration successful. Please check your email to verify your account.',
    });
    return;
  } catch (error) {
    next(error);
  }
}

/** Verify email address */
export async function verifyEmail(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { token } = req.params;
    const user = await prisma.user.findFirst({
      where: { emailToken: token as string },
    });
    if (!user) {
      res.status(400).send('Invalid or expired token.');
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailToken: null,
        isVerified: true,
        status: 'active',
      },
    });

    const loginToken = generateAccessJWT(user.id);

    sendEmail({
      to: user.email,
      subject: 'E-Tactiques - Welcome! 🎉',
      html: accountVerifiedTemplate({
        logoUrl: LOGO_URL,
        frontendUrl: FRONTEND_URL,
      }),
    }).catch((err) => console.warn('Failed to send welcome email:', err));

    res.redirect(`${FRONTEND_URL}/email-verified/${loginToken}`);
    return;
  } catch (err) {
    next(err);
  }
}

/** Login with Google OAuth */
export async function googleAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const ua = req.useragent;
    const ipAddress =
      req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const { credential, recaptchaToken, tenantId } = req.body;

    // reCAPTCHA verification
    if (
      secretKey &&
      process.env.NODE_ENV !== 'test' &&
      recaptchaToken !== 'mock-token'
    ) {
      const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;
      const response = await axios.post(verificationURL);
      const { success, score } = response.data as {
        success: boolean;
        score: number;
      };

      if (!success || score < 0.5) {
        res.status(403).json({ message: 'reCAPTCHA verification failed' });
        return;
      }
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email_verified) {
      res.status(400).json({ message: 'Email not verified by Google' });
      return;
    }

    let user = await prisma.user.findFirst({
      where: {
        OR: [{ email: payload.email, tenantId }, { googleId: payload.sub }],
      },
    });

    if (user?.authProvider === 'local') {
      res.status(409).json({
        message: 'Email already registered with password',
      });
      return;
    }

    const isNewUser = !user;

    if (!user) {
      // Split Google name into first/last
      const nameParts = (payload.name || '').split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      user = await prisma.user.create({
        data: {
          email: payload.email!,
          firstName,
          lastName,
          avatar: payload.picture,
          authProvider: 'google',
          googleId: payload.sub,
          role: 'student',
          status: 'active',
          isVerified: true,
          tenantId,
        },
      });
    }

    const tokenPayload = {
      id: user.id,
      tenantId: user.tenantId,
      role: user.role,
    };
    const token = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);
    const { password: _pw, ...userData } = user;

    if (isNewUser) {
      sendEmail({
        to: user.email,
        subject: 'Welcome to E-Tactiques! 🎉',
        html: accountVerifiedTemplate({
          logoUrl: LOGO_URL,
          frontendUrl: FRONTEND_URL,
        }),
      }).catch((err) => console.warn('Failed to send welcome email:', err));
    } else if (ua) {
      sendEmail({
        to: user.email,
        subject: 'E-Tactiques - New Login Detected',
        html: getLoginAlertTemplate({
          logoUrl: LOGO_URL,
          ipAddress: Array.isArray(ipAddress)
            ? ipAddress[0]
            : ipAddress || 'Unknown',
          browser: ua.browser || 'Unknown',
          platform: ua.platform || 'Unknown',
        }),
      }).catch((err) => console.warn('Failed to send login alert:', err));
    }

    res.json({
      status: 'success',
      data: userData,
      token,
      refreshToken,
    });
    return;
  } catch (error) {
    next(error);
  }
}

/** Login with credentials */
export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const ua = req.useragent;
    const ipAddress =
      req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const { identifier, password, recaptchaToken, tenantId } = req.body;

    // reCAPTCHA verification
    if (
      secretKey &&
      process.env.NODE_ENV !== 'test' &&
      recaptchaToken !== 'mock-token'
    ) {
      const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;
      const response = await axios.post(verificationURL);
      const { success, score } = response.data as {
        success: boolean;
        score: number;
      };

      if (!success || score < 0.5) {
        res.status(403).json({ message: 'reCAPTCHA verification failed.' });
        return;
      }
    }

    // Find user by email within the tenant
    const user = await prisma.user.findFirst({
      where: {
        email: identifier,
        tenantId,
      },
    });

    if (!user) {
      res.status(401).json({
        status: 'failed',
        message: 'Invalid credentials. Please try again.',
      });
      return;
    }

    if (user.status === 'inactive' || user.status === 'suspended') {
      res.status(401).json({
        status: 'failed',
        message: 'Your account is not active. Please contact support.',
      });
      return;
    }

    if (user.authProvider === 'google') {
      res.status(401).json({
        status: 'failed',
        message:
          'This account was registered with Google. Please use Google Sign-In.',
      });
      return;
    }

    if (!user.password) {
      res.status(401).json({
        status: 'failed',
        message: 'Password not set. Please use password reset.',
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({
        status: 'failed',
        message: 'Invalid credentials. Please try again.',
      });
      return;
    }

    if (user.isTwoFactorEnabled) {
      const tempToken = generateTempToken(user.id);
      res.status(200).json({
        status: 'success',
        requires2FA: true,
        tempToken,
        message: '2FA code required.',
      });
      return;
    }

    const tokenPayload = {
      id: user.id,
      tenantId: user.tenantId,
      role: user.role,
    };
    const token = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);
    const { password: _pw, twoFactorSecret: _secret, ...user_data } = user;

    // Send login alert email (fire-and-forget to avoid hanging login)
    if (ua) {
      sendEmail({
        to: user_data.email,
        subject: 'E-Tactiques - New Login Detected',
        html: getLoginAlertTemplate({
          logoUrl: LOGO_URL,
          ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress || '',
          browser: ua.browser || 'Unknown',
          platform: ua.platform || 'Unknown',
        }),
      }).catch((err) =>
        console.warn('Failed to send login alert (suppressed):', err)
      );
    }

    res.status(200).json({
      status: 'success',
      data: user_data,
      token,
      refreshToken,
      message: `Successfully logged in as ${user.role}`,
    });
  } catch (error) {
    next(error);
  }
}

/** Logout and blacklist token */
export async function logout(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'No user is currently logged in.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'No user is currently logged in.' });
      return;
    }

    const existingToken = await prisma.blacklist.findUnique({
      where: { token },
    });
    if (existingToken) {
      res.status(401).json({ message: 'The session is already terminated.' });
      return;
    }

    await prisma.blacklist.create({
      data: { token },
    });

    const refreshToken = req.body?.refreshToken;
    if (refreshToken) {
      try {
        await prisma.blacklist.create({
          data: { token: refreshToken },
        });
      } catch (e) {
        // Ignore if already blacklisted
      }
    }

    res.status(200).json({ message: 'You have successfully logged out.' });
  } catch (err) {
    next(err);
  }
}

/** Enable 2FA */
export async function enable2FA(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const secret = generateSecret();
    const otpauthUrl = generateURI({
      issuer: 'E-Tactiques',
      label: user.email,
      secret,
    });
    const qrCodeUrl = await QRCode.toDataURL(otpauthUrl);

    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorSecret: secret },
    });

    res.status(200).json({
      status: 'success',
      secret,
      qrCodeUrl,
      data: {
        secret,
        qrCodeUrl,
      },
    });
  } catch (error) {
    next(error);
  }
}

/** Verify and activate 2FA */
export async function verify2FASetup(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { code } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });

    if (!user || !user.twoFactorSecret) {
      res
        .status(400)
        .json({ message: '2FA secret not found. Please enable 2FA first.' });
      return;
    }

    const result = await verify({
      token: code,
      secret: user.twoFactorSecret,
    });
    if (!result.valid) {
      res.status(400).json({ message: 'Invalid 2FA code.' });
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isTwoFactorEnabled: true },
    });

    res
      .status(200)
      .json({ status: 'success', message: '2FA enabled successfully.' });
  } catch (error) {
    next(error);
  }
}

/** Disable 2FA */
export async function disable2FA(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { code } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });

    if (!user || !user.twoFactorSecret) {
      res.status(400).json({ message: '2FA is not enabled.' });
      return;
    }

    const result = await verify({
      token: code,
      secret: user.twoFactorSecret,
    });
    if (!result.valid) {
      res.status(400).json({ message: 'Invalid 2FA code.' });
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isTwoFactorEnabled: false, twoFactorSecret: null },
    });

    res
      .status(200)
      .json({ status: 'success', message: '2FA disabled successfully.' });
  } catch (error) {
    next(error);
  }
}

/** Verify 2FA during Login */
export async function verify2FALogin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tempToken, code, tenantId } = req.body;

    if (!tempToken || !code) {
      res
        .status(400)
        .json({ message: 'Temporary token and 2FA code are required.' });
      return;
    }

    let payload;
    try {
      payload = verifyTempToken(tempToken);
    } catch (err) {
      res.status(401).json({ message: 'Invalid or expired temporary token.' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (
      !user ||
      (tenantId && user.tenantId !== tenantId) ||
      (req.tenant && user.tenantId !== req.tenant.id) ||
      !user.isTwoFactorEnabled ||
      !user.twoFactorSecret
    ) {
      res.status(401).json({ message: 'Invalid authentication state.' });
      return;
    }

    const result = await verify({
      token: code,
      secret: user.twoFactorSecret,
    });
    if (!result.valid) {
      res.status(400).json({ message: 'Invalid 2FA code.' });
      return;
    }

    const tokenPayload = {
      id: user.id,
      tenantId: user.tenantId,
      role: user.role,
    };
    const token = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);
    const { password: _pw, twoFactorSecret: _secret, ...userData } = user;

    res.status(200).json({
      status: 'success',
      data: userData,
      token,
      refreshToken,
      message: `Successfully logged in as ${user.role}`,
    });
  } catch (error) {
    next(error);
  }
}

/** Refresh access token */
export async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      res.status(400).json({ message: 'Refresh token is required.' });
      return;
    }

    // Check blacklist to see if this refresh token was revoked
    const blacklistedToken = await prisma.blacklist.findUnique({
      where: { token },
    });
    if (blacklistedToken) {
      res.status(401).json({ message: 'Refresh token has been revoked.' });
      return;
    }

    // Verify the refresh token
    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch (err) {
      res.status(401).json({ message: 'Invalid or expired refresh token.' });
      return;
    }

    // Fetch user and check active status
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      res.status(401).json({ message: 'User not found.' });
      return;
    }

    if (user.status !== 'active') {
      res.status(403).json({ message: 'Account is inactive.' });
      return;
    }

    // Blacklist the old refresh token (token rotation)
    try {
      await prisma.blacklist.create({
        data: {
          token,
          tenantId: user.tenantId,
        },
      });
    } catch (e) {
      // Ignore unique constraint error if already blacklisted
    }

    // Generate new tokens
    const tokenPayload = {
      id: user.id,
      tenantId: user.tenantId,
      role: user.role,
    };
    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);

    res.status(200).json({
      status: 'success',
      token: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    next(error);
  }
}

/** Request password reset */
export async function forgotPassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, recaptchaToken, tenantId } = req.body;

    // reCAPTCHA verification
    if (
      secretKey &&
      process.env.NODE_ENV !== 'test' &&
      recaptchaToken !== 'mock-token'
    ) {
      const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;
      const response = await axios.post(verificationURL);
      const { success, score } = response.data as {
        success: boolean;
        score: number;
      };

      if (!success || score < 0.5) {
        res.status(403).json({ message: 'reCAPTCHA verification failed.' });
        return;
      }
    }

    const user = await prisma.user.findFirst({
      where: { email, tenantId },
    });

    if (!user) {
      res.status(404).json({ message: 'No user with that email.' });
      return;
    }

    if (user.authProvider === 'google') {
      res.status(404).json({
        message: 'This account uses Google login. Please sign in with Google.',
      });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: hashedToken,
        resetPasswordExpire: new Date(Date.now() + 3600000), // 1 hour
      },
    });

    const resetUrl = `${FRONTEND_URL}/reset-password/${resetToken}`;

    await sendEmail({
      to: email,
      subject: 'E-Tactiques - Reset your password',
      html: getPasswordResetTemplate({
        logoUrl: LOGO_URL,
        action: {
          url: resetUrl,
        },
      }),
    });

    res.status(200).json({ message: 'Password reset email sent.' });
    return;
  } catch (error) {
    next(error);
  }
}

/** Reset password with token */
export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { password } = req.body as { password: string };
    const { token } = req.params;

    if (!token || Array.isArray(token)) {
      res.status(400).json({ message: 'Invalid or missing token.' });
      return;
    }

    if (!password) {
      res.status(400).json({ message: 'Please provide a new password.' });
      return;
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { gt: new Date() },
      },
    });

    if (!user) {
      res.status(400).json({ message: 'Invalid or expired token.' });
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpire: null,
      },
    });

    await sendEmail({
      to: user.email,
      subject: 'E-Tactiques - Password Changed Successfully',
      html: passwordChangedTemplate({
        logoUrl: LOGO_URL,
      }),
    });

    res.status(200).json({ message: 'Password reset successfully.' });
  } catch (error) {
    next(error);
  }
}

/** Find all institutes (tenants) associated with an email address */
export async function findInstitutes(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email } = req.body as { email: string };

    const users = await prisma.user.findMany({
      where: { email },
      select: {
        tenant: {
          select: {
            id: true,
            name: true,
            slug: true,
            domain: true,
            isActive: true,
          },
        },
      },
    });

    const institutes = users
      .map((u) => u.tenant)
      .filter((t) => t !== null && t.isActive);

    res.status(200).json({
      status: 'success',
      institutes,
    });
  } catch (error) {
    next(error);
  }
}

/** Change password for logged in user */
export async function changePassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ status: 'error', message: 'Unauthorized' });
      return;
    }
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({
        status: 'error',
        message: 'Both current and new passwords are required',
      });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.password) {
      res.status(404).json({ status: 'error', message: 'User not found' });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res
        .status(400)
        .json({ status: 'error', message: 'Incorrect current password' });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res
      .status(200)
      .json({ status: 'success', message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
}
