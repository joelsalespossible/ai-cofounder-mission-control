#!/bin/bash
# Orchestrator communication script

AGENT_ID="ai_cofounder"
SUPABASE_URL="https://uoosxfbnmoglsgxwxupi.supabase.co"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvb3N4ZmJubW9nbHNneHd4dXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMjkyODUsImV4cCI6MjA4OTgwNTI4NX0.KgS9noiZzvyZgU8IRNjKpN4N4o_XVCsQmNTTFuClFLs"

check_inbox() {
    wget -qO- --header="apikey: $ANON_KEY" \
         --header="Authorization: Bearer $ANON_KEY" \
         "$SUPABASE_URL/rest/v1/agent_messages?or=(to_agent.eq.$AGENT_ID,to_agent.eq.broadcast)&status=eq.unread&order=created_at.asc"
}

send_message() {
    local to_agent="$1"
    local message="$2"
    local priority="${3:-normal}"
    
    wget -qO- --method=POST \
         --header="apikey: $ANON_KEY" \
         --header="Authorization: Bearer $ANON_KEY" \
         --header="Content-Type: application/json" \
         --header="Prefer: return=minimal" \
         --body-data="{\"from_agent\":\"$AGENT_ID\",\"to_agent\":\"$to_agent\",\"message\":\"$message\",\"priority\":\"$priority\",\"status\":\"unread\",\"metadata\":{}}" \
         "$SUPABASE_URL/rest/v1/agent_messages"
}

mark_read() {
    local message_id="$1"
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    
    wget -qO- --method=PATCH \
         --header="apikey: $ANON_KEY" \
         --header="Authorization: Bearer $ANON_KEY" \
         --header="Content-Type: application/json" \
         --header="Prefer: return=minimal" \
         --body-data="{\"status\":\"read\",\"read_at\":\"$timestamp\"}" \
         "$SUPABASE_URL/rest/v1/agent_messages?id=eq.$message_id"
}

case "$1" in
    inbox)
        check_inbox
        ;;
    send)
        send_message "$2" "$3" "$4"
        ;;
    mark-read)
        mark_read "$2"
        ;;
    *)
        echo "Usage: $0 {inbox|send|mark-read}"
        exit 1
        ;;
esac
