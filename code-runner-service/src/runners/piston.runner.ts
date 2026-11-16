export async function runWithPiston(language: string, code: string, testCases: any[]) {
  const results = [];
  let allPassed = true;
  let totalTime = 0;

  // Map our internal languages to Piston language versions
  const languageMap: Record<string, { language: string, version: string }> = {
    'javascript': { language: 'javascript', version: '18.15.0' },
    'python': { language: 'python', version: '3.10.0' },
    'java': { language: 'java', version: '15.0.2' },
    'cpp': { language: 'c++', version: '10.2.0' },
  };

  const pistonLang = languageMap[language];
  if (!pistonLang) {
    throw new Error(`Language ${language} is not supported by Piston runner`);
  }

  // Piston API URL (internal docker network)
  const PISTON_URL = process.env.PISTON_URL || 'http://piston:2000/api/v2/execute';

  if (!testCases || testCases.length === 0) {
    try {
      const response = await fetch(PISTON_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: pistonLang.language,
          version: pistonLang.version,
          files: [{ content: code }]
        })
      });
      const data = await response.json();
      
      const executionTime = data.run?.time ? parseFloat(data.run.time) * 1000 : 0;
      
      if (data.run?.code !== 0) {
        return {
          passed: false,
          executionTime,
          error: data.run?.stderr || data.run?.output,
          results: []
        };
      }

      return {
        passed: true,
        executionTime,
        results: [{ passed: true, output: data.run?.stdout }]
      };
    } catch (err: any) {
      return {
        passed: false,
        executionTime: 0,
        error: err.message,
        results: []
      };
    }
  }

  // Execute each test case
  // Since Piston accepts stdin, we can pass inputData via stdin
  // Note: For complex objects, Piston just feeds it as string to stdin.
  // The user's code must read from stdin and write to stdout.
  for (const tc of testCases) {
    try {
      // In a real competitive programming environment, inputs are passed via stdin.
      // E.g., if inputData is an object { a: 1, b: 2 }, we might pass it as JSON string
      const stdinData = typeof tc.inputData === 'string' ? tc.inputData : JSON.stringify(tc.inputData);
      
      const response = await fetch(PISTON_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: pistonLang.language,
          version: pistonLang.version,
          files: [{ content: code }],
          stdin: stdinData
        })
      });
      const data = await response.json();
      
      const executionTime = data.run?.time ? parseFloat(data.run.time) * 1000 : 0;
      totalTime += executionTime;

      if (data.run?.code !== 0) {
        allPassed = false;
        results.push({
          passed: false,
          error: data.run?.stderr || data.run?.output,
          time: executionTime
        });
        continue;
      }

      const output = data.run?.stdout?.trim();
      const expectedStr = typeof tc.expectedOutput === 'string' ? tc.expectedOutput : JSON.stringify(tc.expectedOutput);
      
      const isPassed = output === expectedStr.trim();
      if (!isPassed) allPassed = false;

      results.push({
        passed: isPassed,
        expected: expectedStr,
        actual: output,
        time: executionTime
      });

    } catch (err: any) {
      allPassed = false;
      results.push({
        passed: false,
        error: err.message,
        time: 0
      });
    }
  }

  return {
    passed: allPassed,
    executionTime: totalTime,
    results
  };
}
