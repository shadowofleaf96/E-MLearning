export type SubscriptionPlan =
  | 'free'
  | 'starter'
  | 'professional'
  | 'enterprise';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  themeConfig?: Record<string, any>;
  subscriptionPlan: SubscriptionPlan;
  domain?: string;
  isActive: boolean;
  hasPaidCourses?: boolean;
  createdAt: string;
  updatedAt: string;
}
