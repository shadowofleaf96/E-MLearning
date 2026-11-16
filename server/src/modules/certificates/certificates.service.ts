import prisma from '../../shared/database/prisma';
import crypto from 'crypto';

export const certificatesService = {
  async getStudentCertificates(tenantId: string, studentId: string) {
    return prisma.certificate.findMany({
      where: { tenantId, studentId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            instructor: { select: { firstName: true, lastName: true } },
          },
        },
      },
      orderBy: { issuedAt: 'desc' },
    });
  },

  async getCertificateById(tenantId: string, certificateId: string) {
    return prisma.certificate.findUnique({
      where: { id: certificateId, tenantId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            instructor: { select: { firstName: true, lastName: true } },
          },
        },
        student: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  },

  async verifyCertificate(tenantId: string, verificationCode: string) {
    return prisma.certificate.findUnique({
      where: { verificationCode, tenantId },
      include: {
        course: { select: { title: true } },
        student: { select: { firstName: true, lastName: true } },
      },
    });
  },

  async generateCertificate(
    tenantId: string,
    studentId: string,
    courseId: string
  ) {
    const existing = await prisma.certificate.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId,
        },
      },
    });

    if (existing) return existing;

    const verificationCode = crypto
      .randomBytes(8)
      .toString('hex')
      .toUpperCase();

    return prisma.certificate.create({
      data: {
        tenantId,
        studentId,
        courseId,
        verificationCode,
      },
    });
  },

  async downloadCertificate() {
    return null; // For now frontend generates the PDF
  },
};
