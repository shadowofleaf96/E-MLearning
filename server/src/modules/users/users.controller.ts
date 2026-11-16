import { Request, Response, NextFunction } from 'express';
import { usersService } from './users.service';
import { AppError } from '../../shared/errors/AppError';

export async function getAllUsers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const queryTenantId = req.query.tenantId as string | undefined;
    const tenantId = queryTenantId || req.user?.tenantId;
    const users = await usersService.getAllUsers(tenantId);
    res.status(200).json({ status: 'success', users });
  } catch (err) {
    next(err);
  }
}

import prisma from '../../shared/database/prisma';

export async function getProfile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw AppError.unauthorized('Authentication required');
    }
    const tenant = await prisma.tenant.findUnique({
      where: { id: req.user.tenantId },
      select: { isInstitution: true },
    });

    const { password: _pw, ...userData } = req.user;
    const finalUserData = {
      ...userData,
      tenant: { isInstitution: tenant?.isInstitution || false },
    };

    res
      .status(200)
      .json({ status: 'success', user: finalUserData, data: finalUserData });
  } catch (err) {
    next(err);
  }
}

export async function getUserById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;
    const userData = await usersService.getUserById(id);
    res.status(200).json({ status: 'success', user: userData });
  } catch (err) {
    next(err);
  }
}

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      throw AppError.badRequest('Tenant context required');
    }

    await usersService.createUser(req.body, tenantId, req.file);

    res.status(201).json({
      status: 'success',
      message: 'User created and welcome email sent successfully.',
    });
  } catch (err) {
    next(err);
  }
}

export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;
    const userData = await usersService.updateUser(id, req.body, req.file);
    res.status(200).json({
      status: 'success',
      message: 'User updated successfully',
      data: userData,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;
    await usersService.deleteUser(id);
    res.status(200).json({
      status: 'success',
      message: 'This user is deleted successfully',
    });
  } catch (err) {
    next(err);
  }
}

export async function updateBilling(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw AppError.unauthorized('User not authenticated');
    }

    const { billingAddress, payoutMethod, payoutDetails } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        billingAddress:
          billingAddress !== undefined ? billingAddress : undefined,
        payoutMethod: payoutMethod !== undefined ? payoutMethod : undefined,
        payoutDetails: payoutDetails !== undefined ? payoutDetails : undefined,
      },
      select: {
        id: true,
        billingAddress: true,
        payoutMethod: true,
        payoutDetails: true,
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'Billing details updated successfully',
      data: updatedUser,
    });
  } catch (err) {
    next(err);
  }
}
