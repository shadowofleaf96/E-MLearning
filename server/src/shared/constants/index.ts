export const ROLES = {
  STUDENT: 'student',
  INSTRUCTOR: 'instructor',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
} as const;

export const AUTH_PROVIDERS = {
  LOCAL: 'local',
  GOOGLE: 'google',
} as const;

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
} as const;

export const ENROLLMENT_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  DROPPED: 'dropped',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

export const EXAM_TYPES = {
  QCM: 'qcm',
  OPEN_ENDED: 'open_ended',
  CODING: 'coding',
  MIXED: 'mixed',
} as const;

export const LESSON_TYPES = {
  VIDEO: 'video',
  PDF: 'pdf',
  TEXT: 'text',
  QUIZ: 'quiz',
} as const;

export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  STARTER: 'starter',
  PROFESSIONAL: 'professional',
  ENTERPRISE: 'enterprise',
} as const;

// Pagination defaults
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

// JWT
export const ACCESS_TOKEN_EXPIRY = '15m';
export const REFRESH_TOKEN_EXPIRY = '7d';

// Code Runner
export const CODE_EXECUTION_TIMEOUT = 23; // seconds
export const CODE_MEMORY_LIMIT = 128; // MB
export const CODE_CPU_LIMIT = 0.5; // cores
