import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { runWithPiston } from './runners/piston.runner';

export const executeRoutes = Router();

const executeSchema = z.object({
  language: z.enum(['javascript', 'python', 'java', 'cpp']),
  code: z.string(),
  testCases: z.array(z.object({
    inputData: z.any(),
    expectedOutput: z.any(),
  })).optional()
});

executeRoutes.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = executeSchema.parse(req.body);
    const { language, code, testCases } = parsed;
    
    // Dispatch to Piston Runner for ALL supported languages
    const result = await runWithPiston(language, code, testCases || []);
    
    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: err.errors });
      return;
    }
    res.status(500).json({ error: err.message || 'Execution failed' });
  }
});
