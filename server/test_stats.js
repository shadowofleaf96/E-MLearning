const fs = require('fs');
const os = require('os');
const { execSync } = require('child_process');

try {
  const stat = fs.statfsSync('C:\\');
  const totalDisk = stat.blocks * stat.bsize;
  const freeDisk = stat.bfree * stat.bsize;
  console.log(`Disk: ${(totalDisk / 1024 / 1024 / 1024).toFixed(2)} GB total`);
  console.log(`Disk Free: ${(freeDisk / 1024 / 1024 / 1024).toFixed(2)} GB free`);
} catch (e) {
  console.error(e);
}

try {
  const cpuStr = execSync('wmic cpu get loadpercentage', { encoding: 'utf8' });
  console.log('CPU:', cpuStr);
} catch (e) {
  console.error(e);
}
