#!/usr/bin/env node
import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

// From Joel's link: thread_ts=1774320495.446929
const threadTs = '1774320495.446929';
const channel = 'C0AN73U5203';

try {
  // Read with thread replies included
  const cmd = `openclaw message thread reply --channel slack --target ${channel} --thread ${threadTs} --limit 100 --json`;
  console.log('Running:', cmd);
  
  const { stdout, stderr } = await execAsync(cmd);
  
  if (stderr) console.error('STDERR:', stderr);
  
  const data = JSON.parse(stdout);
  console.log(JSON.stringify(data, null, 2));
  
} catch (err) {
  console.error('Error:', err.message);
  if (err.stdout) console.log('STDOUT:', err.stdout);
  if (err.stderr) console.error('STDERR:', err.stderr);
  process.exit(1);
}
