# Heartbeat Checklist

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

## Proactive Work (During heartbeats)
- Review and update MEMORY.md every few days
- Commit workspace changes
- Check on active projects
