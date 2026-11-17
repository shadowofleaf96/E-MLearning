export interface CreateApiKeyDto {
  name: string;
  scopes?: string[];
}

export interface CreateWebhookDto {
  url: string;
  events?: string[];
}

export interface UpdateWebhookDto {
  url?: string;
  events?: string[];
  isActive?: boolean;
}

export const AVAILABLE_SCOPES = [
  'read:courses',
  'write:courses',
  'read:users',
  'write:users',
  'read:enrollments',
  'write:enrollments',
  'read:analytics',
] as const;

export const AVAILABLE_WEBHOOK_EVENTS = [
  'course.created',
  'course.updated',
  'enrollment.created',
  'exam.submitted',
  'certificate.issued',
  'user.registered',
] as const;
