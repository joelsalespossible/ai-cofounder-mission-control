#!/usr/bin/env node
import fs from 'fs';

const targetTs = '1774320789.756999';
const data = JSON.parse(fs.readFileSync('/tmp/all-msgs.json', 'utf8'));

const msg = data.payload.messages.find(m => m.ts === targetTs);

if (!msg) {
  console.log(`Message ${targetTs} not found in payload`);
  process.exit(1);
}

console.log('=== FOUND TARGET MESSAGE ===');
console.log('FROM:', msg.user || msg.bot_profile?.name || 'unknown');
console.log('THREAD_TS:', msg.thread_ts);
console.log('TEXT:', msg.text);
console.log('');

if (msg.thread_ts) {
  const thread = data.payload.messages
    .filter(m => m.thread_ts === msg.thread_ts || m.ts === msg.thread_ts)
    .sort((a, b) => parseFloat(a.ts) - parseFloat(b.ts));
  
  console.log(`\n=== FULL THREAD (${thread.length} messages) ===\n`);
  
  for (const m of thread) {
    const from = m.bot_profile?.name || m.user || 'system';
    console.log('---');
    console.log(`FROM: ${from} @ ${m.ts}`);
    console.log(m.text);
    console.log('');
  }
}
