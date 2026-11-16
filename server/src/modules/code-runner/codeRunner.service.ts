import axios from 'axios';
import { AppError } from '../../shared/errors/AppError';

const CODE_RUNNER_URL = process.env.CODE_RUNNER_URL || 'http://localhost:5001';
const CODE_RUNNER_SECRET = process.env.CODE_RUNNER_SECRET || 'dev-secret-123';

interface TestCase {
  inputData: any;
  expectedOutput: any;
}

export const codeRunnerService = {
  async executeCode(
    language: 'javascript' | 'python',
    code: string,
    testCases: TestCase[]
  ) {
    try {
      const response = await axios.post<any>(
        `${CODE_RUNNER_URL}/execute`,
        {
          language,
          code,
          testCases,
        },
        {
          headers: {
            'x-runner-secret': CODE_RUNNER_SECRET,
          },
        }
      );

      return response.data.data;
    } catch (error: any) {
      if (error.response) {
        throw AppError.internal(
          `Code runner service error: ${error.response.data.error || 'Unknown error'}`
        );
      }
      throw AppError.internal('Failed to connect to code runner service');
    }
  },
};
