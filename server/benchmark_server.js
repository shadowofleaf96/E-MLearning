const { spawn, execSync } = require('child_process');
const http = require('http');

const argv = process.argv.slice(2);
const runtimeIndex = argv.indexOf('--runtime');
if (runtimeIndex === -1) {
  console.error("Please provide --runtime [node|bun|custom]");
  process.exit(1);
}
const runtime = argv[runtimeIndex + 1];

const PORT = 5000;
const HOST = 'localhost';
const TOTAL_REQUESTS = 500;
const CONCURRENCY = 50;

function getMemoryUsageMB(pid) {
  try {
    const cmd = `powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter 'ParentProcessId=${pid}' | Select-Object -ExpandProperty WorkingSetSize"`;
    const output = execSync(cmd, { encoding: 'utf8' });
    const lines = output.trim().split('\n');
    if (lines.length > 0 && lines[0].trim().length > 0) {
      const bytes = parseInt(lines[0].trim(), 10);
      return bytes / (1024 * 1024);
    }
  } catch (e) {}
  return 0;
}

function makeRequest(path) {
  return new Promise((resolve) => {
    const start = process.hrtime.bigint();
    const req = http.get(`http://${HOST}:${PORT}${path}`, (res) => {
      res.on('data', () => {});
      res.on('end', () => {
        const end = process.hrtime.bigint();
        resolve({
          timeMs: Number(end - start) / 1e6,
          status: res.statusCode,
        });
      });
    });
    req.on('error', () => {
      const end = process.hrtime.bigint();
      resolve({ timeMs: Number(end - start) / 1e6, status: 0 });
    });
  });
}

async function runLoadTest(name, path) {
  console.log(`\n[Test] ${name}: ${TOTAL_REQUESTS} requests, concurrency ${CONCURRENCY}...`);
  const results = [];
  const testStart = Date.now();

  for (let i = 0; i < TOTAL_REQUESTS; i += CONCURRENCY) {
    const batchSize = Math.min(CONCURRENCY, TOTAL_REQUESTS - i);
    const promises = [];
    for (let j = 0; j < batchSize; j++) {
      promises.push(makeRequest(path));
    }
    const batchResults = await Promise.all(promises);
    results.push(...batchResults);
  }

  const testEnd = Date.now();
  const totalTimeSec = (testEnd - testStart) / 1000;
  
  results.sort((a, b) => a.timeMs - b.timeMs);
  const p50 = results[Math.floor(results.length * 0.50)].timeMs;
  const p95 = results[Math.floor(results.length * 0.95)].timeMs;
  const p99 = results[Math.floor(results.length * 0.99)].timeMs;
  const reqPerSec = TOTAL_REQUESTS / totalTimeSec;

  console.log(`  Throughput : ${reqPerSec.toFixed(2)} req/sec`);
  console.log(`  Latency p50: ${p50.toFixed(2)} ms`);
  console.log(`  Latency p95: ${p95.toFixed(2)} ms`);
  console.log(`  Latency p99: ${p99.toFixed(2)} ms`);

  return { reqPerSec, p50, p95, p99 };
}

async function startBenchmark() {
  console.log(`\n=============================================`);
  console.log(`Benchmarking Runtime: ${runtime.toUpperCase()} (DEV MODE)`);
  console.log(`=============================================`);

  let command, args;
  
  if (runtime === 'node') {
    command = 'npm.cmd';
    args = ['run', 'dev'];
  } else if (runtime === 'bun') {
    command = 'bun';
    args = ['run', 'dev'];
  } else if (runtime === 'custom') {
    command = 'E:\\custom-nodejs\\node\\out\\Release\\node.exe';
    // Using node explicitly on tsx to simulate npm run dev
    args = ['node_modules\\tsx\\dist\\cli.mjs', 'watch', 'src/app.ts'];
  }

  const startTime = Date.now();
  let startupTime = 0;
  
  const server = spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'], shell: true });
  
  let isReady = false;
  server.stdout.on('data', (data) => {
    const msg = data.toString();
    if (msg.includes('Server running') && !isReady) {
      isReady = true;
      startupTime = Date.now() - startTime;
      console.log(`[✔] Server Started in ${startupTime} ms`);
    }
  });

  server.stderr.on('data', (data) => {});

  // Wait for server to start
  while (!isReady) {
    await new Promise(r => setTimeout(r, 100));
    if (Date.now() - startTime > 45000) {
      console.error("Server failed to start within 45 seconds.");
      server.kill();
      process.exit(1);
    }
  }

  // Wait a moment to settle
  await new Promise(r => setTimeout(r, 2000));

  // Run the benchmarks
  await runLoadTest('API Routing', '/api/courses');
  await runLoadTest('Heavy Disk I/O', '/uploads/test-io.txt');

  console.log(`\n--- SUMMARY (${runtime.toUpperCase()}) ---`);
  console.log(`Startup Time : ${startupTime} ms`);
  console.log(`----------------------------------\n`);

  server.kill();
}

startBenchmark().catch(console.error);
