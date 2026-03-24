#!/usr/bin/env node
// Orchestrator communication module

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
  const data = await response.json();
  return data;
}

async function sendMessage(toAgent, message, priority = 'normal') {
  const url = `${SUPABASE_URL}/rest/v1/agent_messages`;
  const body = {
    from_agent: AGENT_ID,
    to_agent: toAgent,
    message: message,
    priority: priority,
    status: 'unread',
    metadata: {}
  };
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { ...headers, 'Prefer': 'return=minimal' },
    body: JSON.stringify(body)
  });
  
  return response.ok;
}

async function markRead(messageId) {
  const url = `${SUPABASE_URL}/rest/v1/agent_messages?id=eq.${messageId}`;
  const body = {
    status: 'read',
    read_at: new Date().toISOString()
  };
  
  const response = await fetch(url, {
    method: 'PATCH',
    headers: { ...headers, 'Prefer': 'return=minimal' },
    body: JSON.stringify(body)
  });
  
  return response.ok;
}

// CLI interface
const [,, command, ...args] = process.argv;

switch (command) {
  case 'inbox':
    const messages = await checkInbox();
    console.log(JSON.stringify(messages, null, 2));
    break;
    
  case 'send':
    const [toAgent, message, priority] = args;
    const sent = await sendMessage(toAgent, message, priority);
    console.log(sent ? 'Message sent' : 'Failed to send');
    break;
    
  case 'mark-read':
    const [messageId] = args;
    const marked = await markRead(messageId);
    console.log(marked ? 'Marked as read' : 'Failed to mark');
    break;
    
  default:
    console.log('Usage: orchestrator.mjs {inbox|send|mark-read}');
    process.exit(1);
}
