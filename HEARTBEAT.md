# Heartbeat Checklist

## 1. Check SaaS Deployment Updates

**Check joel_openclaw messages for progress:**

```bash
curl -s "https://uoosxfbnmoglsgxwxupi.supabase.co/rest/v1/agent_messages?from_agent=eq.joel_openclaw&to_agent=eq.ai_cofounder&order=created_at.desc&limit=30" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvb3N4ZmJubW9nbHNneHd4dXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMjkyODUsImV4cCI6MjA4OTgwNTI4NX0.KgS9noiZzvyZgU8IRNjKpN4N4o_XVCsQmNTTFuClFLs" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvb3N4ZmJubW9nbHNneHd4dXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMjkyODUsImV4cCI6MjA4OTgwNTI4NX0.KgS9noiZzvyZgU8IRNjKpN4N4o_XVCsQmNTTFuClFLs"
```

If new updates found → update `tasks.json` with latest status, commit & push.

## 2. Check Mesh Inbox

```bash
node /tmp/ws/orchestrator.mjs inbox
```

Process any unread messages, respond as needed, mark as read.

## 3. Update Task Dashboard

**After ANY task progress:**
1. Update `tasks.json` with new status/updates
2. Commit and push: `git add tasks.json && git commit -m "Update task: [task_id]" && git push`
3. Dashboard auto-refreshes every 30 seconds

**Dashboard URL:** https://joelsalespossible.github.io/ai-cofounder-mission-control/

## 4. Self-Improving Check

- Read `./skills/self-improving/heartbeat-rules.md`
- Use `~/self-improving/heartbeat-state.md` for last-run markers
- **After ANY mistake or correction: log to ~/self-improving/corrections.md immediately**

---

**Task tracking is MANDATORY. Every heartbeat: check for updates, update tasks.json, commit & push.**
