import { Exam } from './exam.types';

export interface Category {
  id: string;
  tenantId?: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  _count?: {
    courses?: number;
  };
}

export interface Course {
  id: string;
  tenantId: string;
  instructorId: string;
  categoryId?: string;
  category?: Category;
  title: string;
  description?: string;
  price: number | string;
  thumbnail?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  modules?: CourseModule[];
  instructor?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    email?: string;
  };
  tenant?: {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string;
  };
  _count?: {
    enrollments?: number;
    modules?: number;
  };
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  orderIndex: number;
  isLocked: boolean;
  lessons?: Lesson[];
  exams?: Exam[];
}

export type LessonType = 'video' | 'pdf' | 'text' | 'quiz';

export interface Lesson {
  id: string;
  moduleId: string;
  type: LessonType;
  title: string;
  contentUrl?: string;
  content?: string;
  duration?: number;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrolledAt: string;
  status: 'active' | 'completed' | 'dropped';
}
