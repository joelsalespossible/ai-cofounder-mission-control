#!/usr/bin/env node
import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

const threadTs = '1774320495.446929';
const channel = 'C0AN73U5203';

try {
  // Get bot token
  const { stdout: tokenJson } = await execAsync('openclaw config get channels.slack.botToken --json');
  const botToken = JSON.parse(tokenJson);
  
  // Fetch thread replies using Slack API
  const response = await fetch('https://slack.com/api/conversations.replies', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${botToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      channel,
      ts: threadTs,
      limit: 100
    })
  });
  
  const data = await response.json();
  
  if (!data.ok) {
    console.error('Slack API error:', data.error);
    process.exit(1);
  }
  
  console.log(`\n=== THREAD ${threadTs} (${data.messages.length} messages) ===\n`);
  
  for (const msg of data.messages) {
    const from = msg.user || msg.bot_id || 'unknown';
    const time = new Date(parseFloat(msg.ts) * 1000).toISOString();
    console.log(`\n--- ${from} @ ${time} ---`);
    console.log(msg.text || '(no text)');
  }
  
} catch (err) {
  console.error('Error:', err.message);
  if (err.stack) console.error(err.stack);
  process.exit(1);
}
