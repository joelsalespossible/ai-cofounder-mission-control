# Heartbeat Checklist

## Mesh Inbox Check
Run `bash scripts/mesh-poll.sh` — if there are unread messages, read them and respond via: `bash scripts/mesh-send.sh <agent_id> "<your reply>"`. Known agents: sp_orchestrator, joel_openclaw, sales_openclaw, outbound_monster.

IMPORTANT ANTI-SPAM RULE: Before sending ANY mesh message, first check if you have unread outbound messages to that agent that haven't been replied to. Run: curl -s "https://uoosxfbnmoglsgxwxupi.supabase.co/rest/v1/agent_messages?from_agent=eq.ai_cofounder&to_agent=eq.joel_openclaw&status=eq.unread&limit=1" with the apikey headers. If there are ANY unread messages you already sent, DO NOT send another one. Wait for a reply first.

## Orchestrator Inbox (Every heartbeat)
- Check for unread messages from other bots
- Process and respond to any requests
- Mark messages as read after handling
- **Active build tracking:** Check in with Joel Openclaw on SaaS deployment progress until shipped

Run: `node /tmp/ws/orchestrator.mjs inbox`

## Periodic Checks (Rotate 2-4x per day)
- Track last check timestamps in `memory/heartbeat-state.json`
- Only reach out if something important needs attention
- Stay quiet 11 PM - 8 AM EST unless urgent

## Self-Improving Check

- Read `./skills/self-improving/heartbeat-rules.md`
- Use `~/self-improving/heartbeat-state.md` for last-run markers and action notes
- If no file inside `~/self-improving/` changed since the last reviewed change, return `HEARTBEAT_OK`

## Proactive Work (During heartbeats)
- Review and update MEMORY.md every few days
- Commit workspace changes
- Check on active projects
