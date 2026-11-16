import prisma from '../../shared/database/prisma';
import { AppError } from '../../shared/errors/AppError';
import { logger } from '../../utils/logger';

interface CourseOutlineInput {
  topic: string;
  targetLevel?: string;
  moduleCount?: number;
  language?: string;
  categoryId?: string;
}

interface ModuleInput {
  topic: string;
  courseTitle?: string;
  lessonCount?: number;
  language?: string;
}

interface LessonContentInput {
  lessonTitle: string;
  lessonType?: string;
  moduleTitle?: string;
  courseTitle?: string;
  language?: string;
}

interface QuizInput {
  topic: string;
  questionCount?: number;
  difficulty?: string;
  language?: string;
}

interface GeneratedLesson {
  title: string;
  type: 'video' | 'text' | 'pdf' | 'link';
  duration: number;
  content?: string;
  description?: string;
}

interface GeneratedModule {
  title: string;
  description: string;
  orderIndex: number;
  lessons: GeneratedLesson[];
}

interface GeneratedCourseOutline {
  title: string;
  description: string;
  targetLevel: string;
  estimatedTotalHours: number;
  modules: GeneratedModule[];
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

/**
 * Intelligent fallback generator if live API key is not yet set up
 */
function generateFallbackCourse(
  input: CourseOutlineInput
): GeneratedCourseOutline {
  const { topic, targetLevel = 'Beginner', moduleCount = 4 } = input;
  const count = Math.min(Math.max(moduleCount, 1), 6);

  const moduleTemplates = [
    {
      titleSuffix: 'Foundations & Core Principles',
      desc: `Master the essential basics, terminology, and foundational mental models of ${topic}.`,
      lessons: [
        {
          title: `Welcome & Introduction to ${topic}`,
          type: 'video' as const,
          duration: 5,
          description: 'High-level overview and learning outcomes.',
        },
        {
          title: `Core Concepts and Ecosystem`,
          type: 'text' as const,
          duration: 10,
          content: `# Understanding ${topic}\n\nIn this lesson, we explore the primary architecture and fundamentals of ${topic}.`,
        },
        {
          title: `Setting Up Your Development Environment`,
          type: 'video' as const,
          duration: 15,
          description: 'Step-by-step tool installation and configuration.',
        },
      ],
    },
    {
      titleSuffix: 'Practical Deep-Dive & Core Mechanics',
      desc: `Hands-on guided walkthrough applying essential skills in ${topic}.`,
      lessons: [
        {
          title: `Working with Essential Components in ${topic}`,
          type: 'video' as const,
          duration: 12,
          description: 'Understanding real-world workflows and syntax.',
        },
        {
          title: `Common Patterns & Best Practices`,
          type: 'text' as const,
          duration: 8,
          content: `# Best Practices for ${topic}\n\nWriting clean, scalable, and maintainable solutions.`,
        },
        {
          title: `Hands-on Mini Project: Building Your First Implementation`,
          type: 'video' as const,
          duration: 20,
          description: 'Practical coding and problem solving.',
        },
      ],
    },
    {
      titleSuffix: 'Advanced Techniques & Optimization',
      desc: `Take your skills further with performance tuning, edge cases, and architecture.`,
      lessons: [
        {
          title: `Optimizing and Scaling ${topic}`,
          type: 'video' as const,
          duration: 15,
          description: 'Techniques for speed, reliability, and security.',
        },
        {
          title: `Handling Errors & Edge Cases`,
          type: 'text' as const,
          duration: 10,
          content: `# Resilient Architecture in ${topic}\n\nPreventing regressions and building fault-tolerant features.`,
        },
        {
          title: `Testing & Quality Assurance`,
          type: 'video' as const,
          duration: 15,
          description: 'Automated testing and verification.',
        },
      ],
    },
    {
      titleSuffix: 'Real-World Production & Deployment',
      desc: `Ship production-ready solutions and master modern industry standards.`,
      lessons: [
        {
          title: `Production Deployment Pipeline`,
          type: 'video' as const,
          duration: 15,
          description: 'Continuous integration, containerization, and hosting.',
        },
        {
          title: `Monitoring & Observability`,
          type: 'text' as const,
          duration: 10,
          content: `# Maintaining ${topic} in Production\n\nTelemetry, logs, and health metrics.`,
        },
        {
          title: `Capstone Project & Next Steps`,
          type: 'video' as const,
          duration: 25,
          description: 'Reviewing the complete end-to-end implementation.',
        },
      ],
    },
  ];

  const modules: GeneratedModule[] = [];
  let totalMinutes = 0;

  for (let i = 0; i < count; i++) {
    const tmpl = moduleTemplates[i % moduleTemplates.length];
    const moduleLessons: GeneratedLesson[] = tmpl.lessons.map((l) => {
      totalMinutes += l.duration;
      return { ...l };
    });

    modules.push({
      title: `Module ${i + 1}: ${topic} - ${tmpl.titleSuffix}`,
      description: tmpl.desc,
      orderIndex: i,
      lessons: moduleLessons,
    });
  }

  return {
    title: `Complete ${topic} Mastery: From Zero to Hero`,
    description: `A comprehensive, step-by-step masterclass covering ${topic}. Designed for ${targetLevel.toLowerCase()} students seeking practical, production-grade expertise through hands-on lessons, guided walkthroughs, and real-world projects.`,
    targetLevel,
    estimatedTotalHours: parseFloat((totalMinutes / 60).toFixed(1)),
    modules,
  };
}

export const aiService = {
  /**
   * Generate a complete course outline
   */
  async generateCourseOutline(
    input: CourseOutlineInput
  ): Promise<GeneratedCourseOutline> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      logger.info(
        'No GEMINI_API_KEY found, using intelligent course outline fallback generator.'
      );
      return generateFallbackCourse(input);
    }

    try {
      // Dynamic require so server starts even if SDK is being installed
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
You are an expert curriculum designer and educator. Create a complete, highly structured course outline.
Topic: "${input.topic}"
Target Level: "${input.targetLevel || 'Beginner'}"
Desired Module Count: ${input.moduleCount || 4}
Language: "${input.language || 'en'}"

Return ONLY valid JSON matching this exact format, with no markdown code blocks and no surrounding text:
{
  "title": "Clear and captivating course title",
  "description": "Engaging 2-3 paragraph course overview describing what students will build and master.",
  "targetLevel": "${input.targetLevel || 'Beginner'}",
  "estimatedTotalHours": 4.5,
  "modules": [
    {
      "title": "Module Title",
      "description": "Short module summary",
      "orderIndex": 0,
      "lessons": [
        {
          "title": "Lesson Title",
          "type": "video",
          "duration": 10,
          "description": "Short description of the lesson content"
        }
      ]
    }
  ]
}
Each module must have 3 to 5 realistic lessons. Lesson type must be one of: "video", "text", "pdf", "link". Duration must be realistic minutes (e.g. 5 to 25).
`;

      const result = await model.generateContent(prompt);
      const rawText = result.response.text();
      const cleaned = rawText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      const parsed = JSON.parse(cleaned);
      return parsed;
    } catch (err) {
      logger.error(
        'Gemini API call failed, falling back to smart generator:',
        err
      );
      return generateFallbackCourse(input);
    }
  },

  /**
   * Generate a single module with lessons
   */
  async generateModule(input: ModuleInput): Promise<GeneratedModule> {
    const apiKey = process.env.GEMINI_API_KEY;
    const lessonCount = input.lessonCount || 3;

    if (!apiKey) {
      return {
        title: input.topic,
        description: `Comprehensive module covering ${input.topic} with practical hands-on examples.`,
        orderIndex: 0,
        lessons: [
          {
            title: `Introduction to ${input.topic}`,
            type: 'video' as const,
            duration: 8,
            description: `Core concepts and foundational principles of ${input.topic}.`,
          },
          {
            title: `Hands-on Implementation & Practice`,
            type: 'text' as const,
            duration: 15,
            content: `# Implementing ${input.topic}\n\nStep-by-step implementation guide with code snippets.`,
          },
          {
            title: `Advanced Tips & Best Practices`,
            type: 'video' as const,
            duration: 12,
            description: `Pro tips, troubleshooting, and production-level standards.`,
          },
        ].slice(0, lessonCount),
      };
    }

    try {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
Create a structured learning module for a course titled "${input.courseTitle || 'Software Development'}".
Module Topic: "${input.topic}"
Number of lessons: ${lessonCount}
Language: "${input.language || 'en'}"

Return ONLY valid JSON matching this schema:
{
  "title": "Module Title",
  "description": "Module description",
  "orderIndex": 0,
  "lessons": [
    {
      "title": "Lesson Title",
      "type": "video",
      "duration": 10,
      "description": "Brief description"
    }
  ]
}
`;

      const result = await model.generateContent(prompt);
      const rawText = result.response.text();
      const cleaned = rawText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      return JSON.parse(cleaned);
    } catch (err) {
      logger.error('Gemini API generateModule failed, using fallback:', err);
      return {
        title: input.topic,
        description: `Practical lessons covering ${input.topic}.`,
        orderIndex: 0,
        lessons: [
          { title: `${input.topic} Overview`, type: 'video', duration: 10 },
          { title: `${input.topic} In-Depth`, type: 'text', duration: 15 },
        ],
      };
    }
  },

  /**
   * Generate rich markdown lesson content
   */
  async generateLessonContent(
    input: LessonContentInput
  ): Promise<{ content: string; keyTakeaways: string[] }> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return {
        content: `# ${input.lessonTitle}

## Overview
Welcome to **${input.lessonTitle}**. In this lesson, we break down the fundamental mechanisms and provide actionable guidance.

## Key Concepts
1. **Core Architecture**: Why this matters in production workflows.
2. **Implementation Strategy**: How to structure your code effectively.
3. **Common Pitfalls**: What to avoid and how to debug quickly.

\`\`\`typescript
// Example Code
function executeWorkflow() {
  console.log("Executing optimized implementation for ${input.lessonTitle}");
}
\`\`\`

## Practical Exercise
Try building a minimal prototype using the principles discussed above. Review the test cases and verify performance metrics.

## Summary
You now have a solid understanding of ${input.lessonTitle}. Proceed to the next section to continue your journey!`,
        keyTakeaways: [
          `Mastered the core concepts of ${input.lessonTitle}`,
          'Implemented hands-on code examples',
          'Learned common troubleshooting patterns',
        ],
      };
    }

    try {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
You are a master technical instructor. Write a rich, high-quality, comprehensive markdown lesson article for:
Lesson Title: "${input.lessonTitle}"
Module Title: "${input.moduleTitle || 'General'}"
Course: "${input.courseTitle || 'Tech Course'}"
Language: "${input.language || 'en'}"

Format using Markdown with headings (##), code snippets, bullet points, and practical step-by-step walkthroughs.
Also provide 3-4 key takeaways at the end.
Return ONLY valid JSON:
{
  "content": "Full markdown content string (properly escaped)",
  "keyTakeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"]
}
`;

      const result = await model.generateContent(prompt);
      const rawText = result.response.text();
      const cleaned = rawText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      return JSON.parse(cleaned);
    } catch (err) {
      logger.error('Gemini generateLessonContent failed, using fallback:', err);
      return {
        content: `# ${input.lessonTitle}\n\nComprehensive tutorial on ${input.lessonTitle}.`,
        keyTakeaways: [`Understand ${input.lessonTitle}`],
      };
    }
  },

  /**
   * Generate multiple-choice quiz questions
   */
  async generateQuiz(
    input: QuizInput
  ): Promise<{ questions: QuizQuestion[]; passingScore: number }> {
    const apiKey = process.env.GEMINI_API_KEY;
    const count = input.questionCount || 5;

    if (!apiKey) {
      const sampleQuestions: QuizQuestion[] = [
        {
          question: `What is the primary benefit of mastering ${input.topic}?`,
          options: [
            'Improved software scalability and maintainability',
            'Slower development cycle',
            'Higher memory consumption',
            'None of the above',
          ],
          correctAnswer: 0,
          explanation: `${input.topic} promotes scalable, clean, and maintainable software architecture.`,
        },
        {
          question: `Which pattern is considered a best practice in ${input.topic}?`,
          options: [
            'Ignoring error handling',
            'Modular, decoupled component architecture',
            'Hardcoding sensitive credentials in source code',
            'Bypassing validation checks',
          ],
          correctAnswer: 1,
          explanation:
            'Decoupled and modular components ensure testability and extensibility.',
        },
        {
          question: `When should performance profiling be applied in ${input.topic}?`,
          options: [
            'Only after an outage occurs in production',
            'During development and continuous integration benchmarking',
            'Never, profiling is unnecessary',
            'Only once every 5 years',
          ],
          correctAnswer: 1,
          explanation:
            'Continuous profiling catches bottlenecks early before reaching production.',
        },
      ];

      return {
        questions: sampleQuestions.slice(0, count),
        passingScore: 70,
      };
    }

    try {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
Generate ${count} high-quality multiple choice quiz questions for:
Topic: "${input.topic}"
Difficulty: "${input.difficulty || 'Intermediate'}"
Language: "${input.language || 'en'}"

Return ONLY valid JSON matching this schema:
{
  "passingScore": 70,
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Why Option A is correct"
    }
  ]
}
`;

      const result = await model.generateContent(prompt);
      const rawText = result.response.text();
      const cleaned = rawText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      return JSON.parse(cleaned);
    } catch (err) {
      logger.error('Gemini generateQuiz failed, using fallback:', err);
      return {
        passingScore: 70,
        questions: [
          {
            question: `What is the core purpose of ${input.topic}?`,
            options: [
              'Core purpose option A',
              'Option B',
              'Option C',
              'Option D',
            ],
            correctAnswer: 0,
            explanation: 'Option A correctly states the core purpose.',
          },
        ],
      };
    }
  },

  /**
   * Save an AI-generated course and its entire curriculum to the database in an atomic transaction
   */
  async saveAiCourse(
    tenantId: string,
    instructorId: string,
    data: {
      title: string;
      description?: string;
      categoryId?: string | null;
      price?: number;
      modules: {
        title: string;
        description?: string;
        lessons?: {
          title: string;
          type: 'video' | 'text' | 'pdf' | 'link';
          duration: number;
          content?: string;
          contentUrl?: string;
        }[];
      }[];
    }
  ) {
    return prisma.$transaction(async (tx) => {
      // 1. Create Course
      const course = await tx.course.create({
        data: {
          tenantId,
          instructorId,
          title: data.title,
          description: data.description || '',
          categoryId: data.categoryId || null,
          price: data.price || 0,
          isPublished: false,
        },
      });

      // 2. Create Modules & Lessons
      for (let mIdx = 0; mIdx < data.modules.length; mIdx++) {
        const modData = data.modules[mIdx];
        const moduleRecord = await tx.module.create({
          data: {
            tenantId,
            courseId: course.id,
            title: modData.title,
            description: modData.description || '',
            orderIndex: mIdx,
            isLocked: mIdx > 0, // First module is unlocked
          },
        });

        if (modData.lessons && modData.lessons.length > 0) {
          for (let lIdx = 0; lIdx < modData.lessons.length; lIdx++) {
            const lessonData = modData.lessons[lIdx];
            await tx.lesson.create({
              data: {
                tenantId,
                moduleId: moduleRecord.id,
                title: lessonData.title,
                type: lessonData.type as any,
                duration: lessonData.duration || 5,
                content: lessonData.content || '',
                contentUrl: lessonData.contentUrl || '',
                orderIndex: lIdx,
              },
            });
          }
        }
      }

      // Return fully populated course
      return tx.course.findUnique({
        where: { id: course.id },
        include: {
          modules: {
            orderBy: { orderIndex: 'asc' },
            include: {
              lessons: {
                orderBy: { orderIndex: 'asc' },
              },
            },
          },
        },
      });
    });
  },
};
