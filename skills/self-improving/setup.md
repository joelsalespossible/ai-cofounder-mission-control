# Setup — Self-Improving Agent

## 1. Create Memory Structure

```bash
mkdir -p ~/self-improving/{projects,domains,archive}
```

## 2. Initialize Core Files

Automatic:
```bash
python3 ./skills/self-improving/scripts/agent_memory.py init
```

Or create manually:

**~/self-improving/memory.md:**
```markdown
# Self-Improving Memory (HOT)

## Confirmed Preferences

## Active Patterns

## Recent (last 7 days)
```

**~/self-improving/corrections.md:**
```markdown
# Corrections Log

<!-- Format:
## YYYY-MM-DD
- [HH:MM] Changed X → Y | Type: format|technical|communication|project | Count: N/3
-->
```

**~/self-improving/index.md:**
```markdown
# Memory Index

## HOT
- memory.md: 0 lines

## WARM
- (no namespaces yet)

## COLD
- (no archives yet)

Last compaction: never
```

**~/self-improving/heartbeat-state.md:**
```markdown
# Self-Improving Heartbeat State

last_heartbeat_started_at: never
last_reviewed_change_at: never
last_heartbeat_result: never

## Last actions
- none yet
```

## 3. SESSION-STATE.md (workspace root)

Only create if it doesn't already exist:

```markdown
# SESSION-STATE.md — Active Working Memory

## Current Task
[None]

## Key Context
[None yet]

## Pending Actions
- [ ] None

## Recent Decisions
[None yet]

---
*Last updated: [timestamp]*
```

## 4. Update Workspace Files (Non-Destructive)

**⚠️ Add sections — never overwrite existing content.**

### SOUL.md — add section:
```markdown
**Self-Improving**
Before non-trivial work, load ~/self-improving/memory.md.
After corrections or reusable lessons, write one concise entry immediately.
Prefer learned rules when relevant. Keep self-inferred rules revisable.
Do not skip retrieval just because the task feels familiar.
```

### AGENTS.md — add to Memory section:
```markdown
- **Self-improving:** ~/self-improving/ — execution-quality memory (preferences, patterns, corrections)
```

Add before any "Write It Down" section:
```markdown
Before any non-trivial task:
- Read ~/self-improving/memory.md
- List available domain/project files
- Read up to 3 matching files from ~/self-improving/domains/
- If a project is active, also read ~/self-improving/projects/<project>.md
- Do not read unrelated domains "just in case"

Routing:
- Factual context/event → memory/YYYY-MM-DD.md or MEMORY.md
- Correction, preference, workflow/style → ~/self-improving/
- Explicit user correction → ~/self-improving/corrections.md immediately
- Keep entries short, concrete, one lesson per bullet
- After a correction, write it BEFORE the final response (WAL protocol)
```

### HEARTBEAT.md — add section:
```markdown
## Self-Improving Check
- Read ./skills/self-improving/heartbeat-rules.md
- Use ~/self-improving/heartbeat-state.md for run markers
- If no file in ~/self-improving/ changed since last review, return HEARTBEAT_OK
```

## 5. Verify

```bash
python3 ./skills/self-improving/scripts/agent_memory.py status
```

Expected:
```
📊 Agent Memory Status

  ✅ ~/self-improving/memory.md (HOT)
  ✅ ~/self-improving/corrections.md
  ✅ ~/self-improving/index.md
  ✅ ~/self-improving/heartbeat-state.md
  ✅ ~/self-improving/projects/ (0 files)
  ✅ ~/self-improving/domains/ (0 files)
  ✅ ~/self-improving/archive/ (0 files)
  ✅ SESSION-STATE.md (workspace)
  ✅ MEMORY.md (OpenClaw native)
  ✅ memory/ (daily logs)
```

## 6. Optional: Proactivity Companion

At the end of setup, the agent may suggest installing the `proactivity` skill for:
- Noticing missing next steps
- Verifying outcomes instead of assuming
- Recovering context after interruptions

Only install if user explicitly agrees:
```bash
clawhub install proactivity
```
