#!/usr/bin/env node
import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

const threadTs = '1774320495.446929';
const channel = 'C0AN73U5203';

try {
  const { stdout } = await execAsync(`openclaw message read --channel slack --target ${channel} --limit 100 --json`);
  const data = JSON.parse(stdout);
  
  const thread = data.payload.messages
    .filter(m => m.thread_ts === threadTs || m.ts === threadTs)
    .sort((a, b) => parseFloat(a.ts) - parseFloat(b.ts));
  
  console.log(`\n=== THREAD ${threadTs} ===\n`);
  
  for (const msg of thread) {
    const from = msg.bot_profile?.name || msg.user || 'unknown';
    const time = new Date(parseFloat(msg.ts) * 1000).toISOString();
    console.log(`\n--- ${from} @ ${time} ---`);
    console.log(msg.text);
  }
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
