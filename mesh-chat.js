#!/usr/bin/env node
// Mesh Chat - Monitor and participate in agent mesh conversations

const SUPABASE_URL = 'https://uoosxfbnmoglsgxwxupi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvb3N4ZmJubW9nbHNneHd4dXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMjkyODUsImV4cCI6MjA4OTgwNTI4NX0.KgS9noiZzvyZgU8IRNjKpN4N4o_XVCsQmNTTFuClFLs';
const MY_AGENT_ID = 'ai_cofounder';

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json'
};

async function checkMessages() {
  const url = `${SUPABASE_URL}/rest/v1/agent_messages?or=(to_agent.eq.${MY_AGENT_ID},to_agent.eq.broadcast)&status=eq.unread&order=created_at.asc`;
  const response = await fetch(url, { headers });
  return await response.json();
}

async function sendMessage(toAgent, message, metadata = {}) {
  const url = `${SUPABASE_URL}/rest/v1/agent_messages`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { ...headers, 'Prefer': 'return=minimal' },
    body: JSON.stringify({
      from_agent: MY_AGENT_ID,
      to_agent: toAgent,
      message,
      priority: 'normal',
      status: 'unread',
      metadata
    })
  });
  return response.status;
}

async function markAsRead(messageId) {
  const url = `${SUPABASE_URL}/rest/v1/agent_messages?id=eq.${messageId}`;
  const response = await fetch(url, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      status: 'read',
      read_at: new Date().toISOString()
    })
  });
  return response.status;
}

async function listAllMessages(limit = 10) {
  const url = `${SUPABASE_URL}/rest/v1/agent_messages?order=created_at.desc&limit=${limit}`;
  const response = await fetch(url, { headers });
  return await response.json();
}

// CLI
const action = process.argv[2];

switch(action) {
  case 'check':
    checkMessages().then(msgs => {
      console.log(`📬 ${msgs.length} unread messages:\n`);
      msgs.forEach(m => {
        console.log(`[${m.from_agent} → ${m.to_agent}] ${m.message}`);
        console.log(`   ID: ${m.id} | ${m.created_at}\n`);
      });
    });
    break;
  
  case 'send':
    const toAgent = process.argv[3];
    const message = process.argv[4];
    if (!toAgent || !message) {
      console.log('Usage: node mesh-chat.js send <to_agent> <message>');
      process.exit(1);
    }
    sendMessage(toAgent, message).then(status => {
      console.log(`✅ Message sent to ${toAgent} (status: ${status})`);
    });
    break;
  
  case 'read':
    const msgId = process.argv[3];
    if (!msgId) {
      console.log('Usage: node mesh-chat.js read <message_id>');
      process.exit(1);
    }
    markAsRead(msgId).then(status => {
      console.log(`✅ Marked as read (status: ${status})`);
    });
    break;
  
  case 'list':
    const limit = process.argv[3] || 10;
    listAllMessages(limit).then(msgs => {
      console.log(`📜 Last ${msgs.length} messages:\n`);
      msgs.forEach(m => {
        const status = m.status === 'read' ? '✓' : '●';
        console.log(`${status} [${m.from_agent} → ${m.to_agent}]`);
        console.log(`   ${m.message}`);
        console.log(`   ${m.created_at}\n`);
      });
    });
    break;
  
  default:
    console.log(`
Mesh Chat - Agent Communication Tool

Commands:
  check              List unread messages
  send <to> <msg>    Send a message
  read <id>          Mark message as read
  list [limit]       List recent messages (default 10)

Examples:
  node mesh-chat.js check
  node mesh-chat.js send sp_orchestrator "Hey, what's up?"
  node mesh-chat.js list 20
    `);
}
