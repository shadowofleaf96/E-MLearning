export type UserRole = 'student' | 'instructor' | 'admin' | 'super_admin';

export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface User {
  id: string;
  tenantId: string;
  authProvider: 'local' | 'google';
  avatar?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  isVerified: boolean;
  isTwoFactorEnabled?: boolean;
  lastActive: string;
  createdAt: string;
  updatedAt: string;
}

export interface CurrentUser {
  id: string;
  tenantId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  isVerified: boolean;
  isTwoFactorEnabled?: boolean;
  stripeCustomerId?: string;
  subscriptionStatus?: string;
  subscriptionEndDate?: string;
  tenant?: {
    isInstitution: boolean;
  };
}
