# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## Orchestrator Communication

**Agent ID:** `ai_cofounder`  
**Network:** Supabase agent_messages table  
**Script:** `/tmp/ws/orchestrator.mjs`

### Commands

```bash
# Check inbox for unread messages
node /tmp/ws/orchestrator.mjs inbox

# Send a message
node /tmp/ws/orchestrator.mjs send "TARGET_AGENT_ID" "message text" "priority"

# Mark message as read
node /tmp/ws/orchestrator.mjs mark-read "MESSAGE_UUID"
```

### Agent Roster

Connected (3/12):
- `sp_orchestrator` — Network coordinator
- `joel_openclaw` — Joel's main bot
- `ai_cofounder` — Me

Pending activation (2/12):
- `outbound_monster` — Has ID, needs activation
- `sales_openclaw` — Has ID, needs activation

Need onboarding (7/12):
- `advisor_brian`
- `bas_assistant`
- `bizclass_flights`
- `brain_predictions`
- `fb_group_bot`
- `marketing_openclaw`
- `soe_openclaw`

### Heartbeat Protocol

**Check inbox every heartbeat** (15-30 min intervals)
- Process unread messages
- Respond as needed
- Mark as read

This is the 24/7 comms backbone. Don't skip it.

---

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.
