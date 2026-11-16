import bcrypt from 'bcrypt';
import prisma from '../../shared/database/prisma';
import { AppError } from '../../shared/errors/AppError';
import { getPublicUrl } from '../../utils/fileUtils';
import { sendEmail } from '../../utils/email';
import { getWelcomeEmailTemplate } from '../../utils/emailTemplates';
import { env } from '../../config/env';

const LOGO_URL = process.env.LOGO_URL;
const FRONTEND_URL = env.FRONTEND_URL;

export const usersService = {
  async getAllUsers(tenantId?: string) {
    return prisma.user.findMany({
      where: {
        ...(tenantId ? { tenantId } : {}),
        role: { not: 'super_admin' },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        avatar: true,
        role: true,
        status: true,
        isVerified: true,
        authProvider: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  async getUserById(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw AppError.notFound('User not found');
    const { password: _pw, ...userData } = user;
    return userData;
  },

  async createUser(data: any, tenantId: string, file?: any) {
    let avatarUrl = null;

    const existingUser = await prisma.user.findFirst({
      where: { email: data.email, tenantId },
    });

    if (existingUser) {
      throw AppError.badRequest(
        'It seems you already have an account, please log in instead.'
      );
    }

    if (file) {
      avatarUrl = getPublicUrl(file.path);
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const newUser = await prisma.user.create({
      data: {
        authProvider: 'local',
        firstName: data.firstName,
        lastName: data.lastName,
        password: hashedPassword,
        email: data.email,
        role: data.role,
        status: data.status,
        avatar: avatarUrl,
        isVerified: true,
        tenantId,
      },
    });

    const loginUrl = `${FRONTEND_URL}/login`;

    await sendEmail({
      to: data.email,
      subject: 'Welcome to E-Tactiques!',
      html: getWelcomeEmailTemplate({
        logoUrl: LOGO_URL,
        frontendUrl: FRONTEND_URL,
        user: { name: `${data.firstName} ${data.lastName}` },
        action: {
          url: loginUrl,
          text: 'Log In',
        },
      }),
    });

    return newUser;
  },

  async updateUser(id: string, data: any, file?: any) {
    const updates = { ...data };

    if (file) {
      updates.avatar = getPublicUrl(file.path);
    }

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw AppError.notFound('User not found');
    }

    if (updates.email) {
      const userWithEmail = await prisma.user.findFirst({
        where: {
          email: updates.email,
          tenantId: existingUser.tenantId,
          NOT: { id },
        },
      });
      if (userWithEmail) {
        throw AppError.badRequest('Email is already in use by another user');
      }
    }

    if (existingUser.authProvider === 'google' && updates.password) {
      delete updates.password;
    }

    if (updates.password) {
      const salt = await bcrypt.genSalt(12);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updates,
    });

    const { password: _pw, ...userData } = updatedUser;
    return userData;
  },

  async deleteUser(id: string) {
    try {
      await prisma.user.delete({ where: { id } });
    } catch (e: any) {
      if (e.code === 'P2025') {
        throw AppError.notFound('User not found');
      }
      throw e;
    }
  },
};
