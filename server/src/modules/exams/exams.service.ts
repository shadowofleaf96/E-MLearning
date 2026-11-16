import prisma from '../../shared/database/prisma';
import { AppError } from '../../shared/errors/AppError';

export const examsService = {
  async getInstructorExams(tenantId: string, instructorId: string) {
    return prisma.exam.findMany({
      where: {
        tenantId,
        module: {
          course: {
            instructorId,
          },
        },
      },
      include: {
        module: {
          include: {
            course: {
              select: { title: true },
            },
          },
        },
        _count: {
          select: { questions: true, examAttempts: true },
        },
        examAttempts: {
          select: { score: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getExamsByModule(tenantId: string, moduleId: string) {
    return prisma.exam.findMany({
      where: { tenantId, moduleId },
      include: {
        questions: {
          include: {
            qcmOptions: {
              select: { id: true, optionText: true }, // Hide isCorrect by default for listing
            },
            codingExercise: true,
          },
        },
      },
    });
  },

  async getExamById(
    tenantId: string,
    examId: string,
    includeAnswers: boolean = false
  ) {
    const exam = await prisma.exam.findFirst({
      where: { id: examId, tenantId },
      include: {
        questions: {
          include: {
            qcmOptions: includeAnswers
              ? true
              : {
                  select: {
                    id: true,
                    optionText: true,
                    questionId: true,
                    tenantId: true,
                  },
                },
            codingExercise: {
              include: {
                testCases: includeAnswers
                  ? true
                  : {
                      where: { isHidden: false }, // Hide private test cases if not including answers
                    },
              },
            },
          },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (!exam) {
      throw AppError.notFound('Exam not found');
    }
    return exam;
  },

  async createExam(tenantId: string, moduleId: string, data: any) {
    return prisma.exam.create({
      data: {
        tenantId,
        moduleId,
        title: data.title,
        type: data.type || 'QUIZ', // ExamType
        durationMinutes: data.durationMinutes || 60,
        passingScore: data.passingScore || 50,
        maxAttempts: data.maxAttempts || 3,
        questions: {
          create:
            data.questions?.map((q: any, i: number) => ({
              tenantId,
              type: q.type,
              questionText: q.questionText,
              points: q.points || 1,
              orderIndex: i,
              ...(q.type === 'qcm'
                ? {
                    qcmOptions: {
                      create:
                        q.qcmOptions?.map((o: any) => ({
                          tenantId,
                          optionText: o.optionText,
                          isCorrect: o.isCorrect,
                        })) || [],
                    },
                  }
                : {}),
              ...(q.type === 'coding'
                ? {
                    codingExercise: {
                      create: {
                        tenantId,
                        language: q.codingExercise.language,
                        starterCode: q.codingExercise.starterCode,
                        solutionTemplate: q.codingExercise.solutionTemplate,
                        testCases: {
                          create:
                            q.codingExercise.testCases?.map((tc: any) => ({
                              tenantId,
                              inputData: tc.inputData,
                              expectedOutput: tc.expectedOutput,
                              isHidden: tc.isHidden || false,
                            })) || [],
                        },
                      },
                    },
                  }
                : {}),
            })) || [],
        },
      },
      include: {
        questions: {
          include: {
            qcmOptions: true,
            codingExercise: { include: { testCases: true } },
          },
        },
      },
    });
  },

  async updateExam(tenantId: string, examId: string, data: any) {
    const exam = await prisma.exam.findFirst({
      where: { id: examId, tenantId },
    });
    if (!exam) throw AppError.notFound('Exam not found');

    return prisma.exam.update({
      where: { id: examId },
      data: {
        title: data.title,
        type: data.type,
        durationMinutes: data.durationMinutes,
        passingScore: data.passingScore,
        maxAttempts: data.maxAttempts,
      },
    });
  },

  async deleteExam(tenantId: string, examId: string) {
    const exam = await prisma.exam.findFirst({
      where: { id: examId, tenantId },
    });
    if (!exam) throw AppError.notFound('Exam not found');

    return prisma.exam.delete({
      where: { id: examId },
    });
  },

  async startAttempt(tenantId: string, examId: string, studentId: string) {
    // Check if there is already an active attempt
    const existing = await prisma.examAttempt.findFirst({
      where: { tenantId, examId, studentId, submittedAt: null },
    });
    if (existing) {
      return existing;
    }

    return prisma.examAttempt.create({
      data: {
        tenantId,
        examId,
        studentId,
      },
    });
  },

  async submitAttempt(tenantId: string, attemptId: string, answers: any[]) {
    // 1. Get attempt and exam
    const attempt = await prisma.examAttempt.findFirst({
      where: { id: attemptId, tenantId, submittedAt: null },
      include: {
        exam: { include: { questions: { include: { qcmOptions: true } } } },
      },
    });

    if (!attempt) {
      throw AppError.notFound('Active exam attempt not found');
    }

    let score = 0;
    let totalPoints = 0;

    // 2. Grade QCM questions
    for (const q of attempt.exam.questions) {
      totalPoints += q.points;

      if (q.type === 'qcm') {
        const studentAnswer = answers.find((a) => a.questionId === q.id);
        if (studentAnswer) {
          // In a simple QCM, student provides optionId
          const selectedOption = q.qcmOptions.find(
            (o) => o.id === studentAnswer.optionId
          );
          if (selectedOption?.isCorrect) {
            score += q.points;
          }
        }
      }
      // Note: Coding questions are graded asynchronously or pre-graded by `coding.service.ts`
      // For this simplified logic, we just assume if they passed the coding submission, we add points.
      if (q.type === 'coding') {
        // Find if there is a successful submission
        const codingSub = await prisma.codingSubmission.findFirst({
          where: {
            tenantId,
            examAttemptId: attemptId,
            codingExercise: { questionId: q.id },
          },
          orderBy: { createdAt: 'desc' },
        });
        if (codingSub && codingSub.passed) {
          score += q.points;
        }
      }
    }

    const percentage = totalPoints > 0 ? (score / totalPoints) * 100 : 0;
    const passed = percentage >= attempt.exam.passingScore;

    // 3. Close attempt
    const finishedAttempt = await prisma.examAttempt.update({
      where: { id: attemptId },
      data: {
        submittedAt: new Date(),
        score: percentage,
        passed,
      },
    });

    return finishedAttempt;
  },
};
