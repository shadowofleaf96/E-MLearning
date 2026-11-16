import { codeRunnerService } from '../src/modules/code-runner/codeRunner.service';

async function testRunner() {
  console.log('Testing JS Execution...');
  try {
    const jsResult = await codeRunnerService.executeCode('javascript', `
      output = input.a + input.b;
    `, [
      { inputData: { a: 5, b: 10 }, expectedOutput: 15 },
      { inputData: { a: -5, b: 5 }, expectedOutput: 0 }
    ]);
    console.log('JS Result:', JSON.stringify(jsResult, null, 2));
  } catch (err: any) {
    console.error('JS Error:', err.message);
  }

  console.log('\nTesting Python Execution...');
  try {
    const pyResult = await codeRunnerService.executeCode('python', `
output = input_data['a'] + input_data['b']
    `, [
      { inputData: { a: 5, b: 10 }, expectedOutput: 15 },
      { inputData: { a: -5, b: 5 }, expectedOutput: 0 }
    ]);
    console.log('PY Result:', JSON.stringify(pyResult, null, 2));
  } catch (err: any) {
    console.error('PY Error:', err.message);
  }
}

testRunner();
