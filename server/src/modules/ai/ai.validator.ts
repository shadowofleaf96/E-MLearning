import { z } from 'zod';

export const aiSchemas = {
  generateCourseOutline: z.object({
    topic: z.string().min(3, 'Topic must be at least 3 characters long'),
    targetLevel: z
      .enum(['Beginner', 'Intermediate', 'Advanced', 'All Levels'])
      .optional()
      .default('Beginner'),
    moduleCount: z.coerce.number().min(1).max(10).optional().default(4),
    language: z.string().optional().default('en'),
    categoryId: z.string().optional(),
  }),

  generateModule: z.object({
    topic: z.string().min(3, 'Module topic must be at least 3 characters long'),
    courseTitle: z.string().optional(),
    lessonCount: z.coerce.number().min(1).max(10).optional().default(3),
    language: z.string().optional().default('en'),
  }),

  generateLessonContent: z.object({
    lessonTitle: z.string().min(2, 'Lesson title is required'),
    lessonType: z
      .enum(['text', 'video', 'pdf', 'link'])
      .optional()
      .default('text'),
    moduleTitle: z.string().optional(),
    courseTitle: z.string().optional(),
    language: z.string().optional().default('en'),
  }),

  generateQuiz: z.object({
    topic: z.string().min(2, 'Quiz topic is required'),
    questionCount: z.coerce.number().min(1).max(20).optional().default(5),
    difficulty: z
      .enum(['Beginner', 'Intermediate', 'Advanced'])
      .optional()
      .default('Intermediate'),
    language: z.string().optional().default('en'),
  }),

  saveAiCourse: z.object({
    title: z.string().min(1, 'Course title is required'),
    description: z.string().optional().default(''),
    categoryId: z.string().optional().nullable(),
    price: z.coerce.number().min(0).optional().default(0),
    modules: z
      .array(
        z.object({
          title: z.string().min(1, 'Module title is required'),
          description: z.string().optional().default(''),
          lessons: z
            .array(
              z.object({
                title: z.string().min(1, 'Lesson title is required'),
                type: z.enum(['text', 'video', 'pdf', 'link']).default('video'),
                duration: z.coerce.number().min(0).default(5),
                content: z.string().optional().default(''),
                contentUrl: z.string().optional().default(''),
              })
            )
            .optional()
            .default([]),
        })
      )
      .min(1, 'At least one module is required'),
  }),
};
