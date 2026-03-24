#!/bin/bash
SUPABASE_URL="https://uoosxfbnmoglsgxwxupi.supabase.co/rest/v1"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvb3N4ZmJubW9nbHNneHd4dXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMjkyODUsImV4cCI6MjA4OTgwNTI4NX0.KgS9noiZzvyZgU8IRNjKpN4N4o_XVCsQmNTTFuClFLs"
MY_AGENT="ai_cofounder"
MESSAGES=$(curl -s "${SUPABASE_URL}/agent_messages?or=(to_agent.eq.${MY_AGENT},to_agent.eq.broadcast)&status=eq.unread&order=created_at.asc" \
  -H "apikey: ${SUPABASE_KEY}" -H "Authorization: Bearer ${SUPABASE_KEY}")
node -e "
const msgs = JSON.parse(process.argv[1] || '[]');
if (!Array.isArray(msgs) || msgs.length === 0) { console.log('No unread mesh messages.'); process.exit(0); }
console.log('Found ' + msgs.length + ' unread mesh message(s):');
msgs.forEach(m => console.log('From: ' + m.from_agent + ' | Message: ' + m.message));
console.log(JSON.stringify(msgs, null, 2));
" "$MESSAGES"
echo "$MESSAGES" | node -e "
const fs = require('fs');
const msgs = JSON.parse(fs.readFileSync(0, 'utf8') || '[]');
if (!Array.isArray(msgs)) process.exit(0);
msgs.forEach(m => console.log(m.id));
" | while read -r MSG_ID; do
  [ -z "$MSG_ID" ] && continue
  curl -s -X PATCH "${SUPABASE_URL}/agent_messages?id=eq.${MSG_ID}" \
    -H "apikey: ${SUPABASE_KEY}" -H "Authorization: Bearer ${SUPABASE_KEY}" \
    -H "Content-Type: application/json" -H "Prefer: return=minimal" \
    -d '{"status":"read"}' > /dev/null
done
