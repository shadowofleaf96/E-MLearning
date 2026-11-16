import { Request, Response, NextFunction } from 'express';
import { certificatesService } from './certificates.service';

export async function getStudentCertificates(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id: studentId, tenantId } = req.user!;
    const certificates = await certificatesService.getStudentCertificates(
      tenantId,
      studentId
    );
    res.status(200).json({ status: 'success', data: certificates });
  } catch (error) {
    next(error);
  }
}

export async function getCertificateById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tenantId } = req.user!;
    const { id } = req.params;
    const certificate = await certificatesService.getCertificateById(
      tenantId,
      id
    );
    if (!certificate) {
      res
        .status(404)
        .json({ status: 'error', message: 'Certificate not found' });
      return;
    }
    res.status(200).json({ status: 'success', data: certificate });
  } catch (error) {
    next(error);
  }
}

export async function downloadCertificate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Return not implemented for now since frontend handles PDF generation
    res.status(501).json({
      status: 'error',
      message: 'downloadCertificate not yet implemented on server',
    });
  } catch (error) {
    next(error);
  }
}

export async function verifyCertificate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { verificationCode } = req.params;
    // For verify we might not have a logged in user, but assuming tenant is resolved by middleware
    const tenantId = req.tenant?.id || req.user?.tenantId;

    if (!tenantId) {
      res.status(400).json({ status: 'error', message: 'Tenant not resolved' });
      return;
    }

    const certificate = await certificatesService.verifyCertificate(
      tenantId,
      verificationCode
    );
    if (!certificate) {
      res
        .status(404)
        .json({ status: 'error', message: 'Invalid or missing certificate' });
      return;
    }
    res.status(200).json({ status: 'success', data: certificate });
  } catch (error) {
    next(error);
  }
}

export async function generateCertificate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tenantId } = req.user!;
    const { studentId, courseId } = req.body;

    if (!studentId || !courseId) {
      res
        .status(400)
        .json({ status: 'error', message: 'Missing required fields' });
      return;
    }

    const certificate = await certificatesService.generateCertificate(
      tenantId,
      studentId,
      courseId
    );
    res.status(201).json({ status: 'success', data: certificate });
  } catch (error) {
    next(error);
  }
}
