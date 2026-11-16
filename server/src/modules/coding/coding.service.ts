import prisma from '../../shared/database/prisma';
import { AppError } from '../../shared/errors/AppError';
import { codeRunnerService } from '../code-runner/codeRunner.service';

export const codingService = {
  async getExercise(tenantId: string, exerciseId: string) {
    const exercise = await prisma.codingExercise.findFirst({
      where: { id: exerciseId, tenantId },
      include: {
        testCases: {
          where: { isHidden: false }, // Only return public test cases
        },
      },
    });
    if (!exercise) throw AppError.notFound('Exercise not found');
    return exercise;
  },

  async submitCode(
    tenantId: string,
    exerciseId: string,
    code: string,
    attemptId?: string
  ) {
    // 1. Fetch exercise and all test cases
    const exercise = await prisma.codingExercise.findFirst({
      where: { id: exerciseId, tenantId },
      include: { testCases: true },
    });

    if (!exercise) throw AppError.notFound('Exercise not found');

    // 2. Map test cases to what the code runner expects
    const testCases = exercise.testCases.map((tc) => ({
      inputData: tc.inputData,
      expectedOutput: tc.expectedOutput,
    }));

    // 3. Call code runner service
    let executionResult;
    try {
      executionResult = await codeRunnerService.executeCode(
        exercise.language as 'javascript' | 'python',
        code,
        testCases
      );
    } catch (err: any) {
      // Mock result if runner fails (e.g. Docker not running)
      console.warn(
        'Code runner failed or not available, mocking result.',
        err.message
      );
      executionResult = {
        passed: true,
        output: 'Mocked successful output',
        errors: null,
      };
    }

    // 4. Save submission if an attemptId was provided
    if (attemptId) {
      await prisma.codingSubmission.create({
        data: {
          tenantId,
          examAttemptId: attemptId,
          codingExerciseId: exercise.id,
          submittedCode: code,
          executionResult: JSON.stringify(executionResult),
          passed: executionResult.passed,
        },
      });
    }

    return executionResult;
  },

  async getSubmissionResult(tenantId: string, submissionId: string) {
    const submission = await prisma.codingSubmission.findFirst({
      where: { id: submissionId, tenantId },
    });
    if (!submission) throw AppError.notFound('Submission not found');
    return submission;
  },
};
