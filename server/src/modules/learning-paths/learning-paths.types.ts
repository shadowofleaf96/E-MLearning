export interface CreateLearningPathDto {
  title: string;
  description?: string;
  thumbnail?: string;
  price?: number;
  isPublished?: boolean;
  courseIds?: string[];
}

export interface UpdateLearningPathDto {
  title?: string;
  description?: string;
  thumbnail?: string;
  price?: number;
  isPublished?: boolean;
  courseIds?: string[];
}

export interface LearningPathProgress {
  learningPathId: string;
  title: string;
  totalCourses: number;
  completedCourses: number;
  progressPercentage: number;
  isCompleted: boolean;
  courses: {
    courseId: string;
    title: string;
    orderIndex: number;
    isEnrolled: boolean;
    isCompleted: boolean;
    progressPercentage: number;
  }[];
}
