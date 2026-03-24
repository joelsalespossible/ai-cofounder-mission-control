#!/usr/bin/env node
// 15-minute check-in script: polls orchestrator inbox and sends updates to Joel

const AGENT_ID = "ai_cofounder";
const SUPABASE_URL = "https://uoosxfbnmoglsgxwxupi.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvb3N4ZmJubW9nbHNneHd4dXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMjkyODUsImV4cCI6MjA4OTgwNTI4NX0.KgS9noiZzvyZgU8IRNjKpN4N4o_XVCsQmNTTFuClFLs";

const headers = {
  'apikey': ANON_KEY,
  'Authorization': `Bearer ${ANON_KEY}`,
  'Content-Type': 'application/json'
};

async function checkInbox() {
  const url = `${SUPABASE_URL}/rest/v1/agent_messages?or=(to_agent.eq.${AGENT_ID},to_agent.eq.broadcast)&status=eq.unread&order=created_at.asc`;
  const response = await fetch(url, { headers });
  return await response.json();
}

async function markRead(messageId) {
  const url = `${SUPABASE_URL}/rest/v1/agent_messages?id=eq.${messageId}`;
  const body = {
    status: 'read',
    read_at: new Date().toISOString()
  };
  
  await fetch(url, {
    method: 'PATCH',
    headers: { ...headers, 'Prefer': 'return=minimal' },
    body: JSON.stringify(body)
  });
}

async function sendToJoel(message) {
  // Use openclaw message tool via subprocess
  const { spawn } = await import('child_process');
  
  return new Promise((resolve, reject) => {
    const proc = spawn('openclaw', [
      'message',
      'send',
      '--channel', 'slack',
      '--target', 'channel:C0AN73U5203',
      '--text', message
    ]);
    
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Failed with code ${code}`));
    });
  });
}

// Main check-in logic
async function main() {
  const messages = await checkInbox();
  
  let update = `🤖 *15-min check-in*\n\n`;
  
  if (messages.length > 0) {
    update += `📬 *Inbox:* ${messages.length} unread message(s)\n\n`;
    
    for (const msg of messages) {
      const from = msg.from_agent;
      const preview = msg.message.substring(0, 100);
      update += `• *${from}*: ${preview}${msg.message.length > 100 ? '...' : ''}\n`;
      
      // Mark as read
      await markRead(msg.id);
    }
    
    update += `\n_All messages marked as read._\n`;
  } else {
    update += `📭 *Inbox:* No new messages from the bot network.\n`;
  }
  
  update += `\n💬 *Questions or instructions for me?*`;
  
  await sendToJoel(update);
}

main().catch(console.error);
