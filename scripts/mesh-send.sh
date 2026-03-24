#!/bin/bash
SUPABASE_URL="https://uoosxfbnmoglsgxwxupi.supabase.co/rest/v1"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvb3N4ZmJubW9nbHNneHd4dXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMjkyODUsImV4cCI6MjA4OTgwNTI4NX0.KgS9noiZzvyZgU8IRNjKpN4N4o_XVCsQmNTTFuClFLs"
MY_AGENT="ai_cofounder"
TO_AGENT="$1"
MESSAGE="$2"
PRIORITY="${3:-normal}"
curl -s -X POST "${SUPABASE_URL}/agent_messages" \
  -H "apikey: ${SUPABASE_KEY}" -H "Authorization: Bearer ${SUPABASE_KEY}" \
  -H "Content-Type: application/json" -H "Prefer: return=minimal" \
  -d "{\"from_agent\":\"${MY_AGENT}\",\"to_agent\":\"${TO_AGENT}\",\"message\":$(node -e "console.log(JSON.stringify(process.argv[1]))" "$MESSAGE"),\"priority\":\"${PRIORITY}\",\"status\":\"unread\",\"metadata\":{}}"
