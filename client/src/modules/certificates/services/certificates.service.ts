import api from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';

export interface CertificateItem {
  id: string;
  courseId: string;
  verificationCode: string;
  issuedAt: string;
  course?: {
    title: string;
    thumbnail: string | null;
  };
}

export const certificatesService = {
  async getStudentCertificates(): Promise<CertificateItem[]> {
    const res = await api.get(ENDPOINTS.CERTIFICATES.STUDENT);
    return res.data.data;
  },

  async getCertificateById(id: string): Promise<CertificateItem> {
    const res = await api.get(ENDPOINTS.CERTIFICATES.DETAIL(id));
    return res.data.data;
  },

  async downloadCertificate(id: string): Promise<Blob> {
    const res = await api.get(ENDPOINTS.CERTIFICATES.DOWNLOAD(id), {
      responseType: 'blob',
    });
    return res.data;
  },

  async verifyCertificate(code: string): Promise<any> {
    const res = await api.get(ENDPOINTS.CERTIFICATES.VERIFY(code));
    return res.data.data;
  },
};
