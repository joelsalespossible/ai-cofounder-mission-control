---
name: self-improving
description: "Self-reflection, self-criticism, self-learning, and persistent memory with WAL protocol. Agent evaluates its own work, catches mistakes, learns from corrections, and manages tiered memory that compounds execution quality over time. Use when: (1) a command, tool, or operation fails; (2) the user corrects you or rejects your work; (3) you realize your knowledge is outdated or incorrect; (4) you discover a better approach; (5) you complete significant work and want to evaluate the outcome; (6) context persistence and session state management is needed."
---

# Self-Improving Agent

Self-reflection + correction logging + tiered memory + WAL protocol in one system. No API keys required. File-based. Works with existing OpenClaw memory (MEMORY.md, memory/) without overwriting anything.

## Architecture

Two memory systems, complementary — never conflicting:

| System | Location | Purpose |
|--------|----------|---------|
| OpenClaw native | MEMORY.md, memory/*.md | Facts, events, decisions, daily logs |
| Self-improving | ~/self-improving/ | Execution quality: corrections, patterns, preferences |

```
Workspace (OpenClaw native — skill never overwrites these):
├── MEMORY.md               # Long-term curated facts
├── SESSION-STATE.md         # Hot RAM (WAL protocol)
└── memory/
    └── YYYY-MM-DD.md       # Daily logs

~/self-improving/ (this skill manages):
├── memory.md               # HOT: ≤100 lines, always loaded
├── index.md                # Topic index with line counts
├── corrections.md          # Last 50 corrections
├── heartbeat-state.md      # Maintenance markers
├── projects/               # Per-project learnings
├── domains/                # Domain-specific (code, comms, etc.)
└── archive/                # COLD: decayed patterns
```

### Where to store what

| Content type | Store in |
|-------------|----------|
| Facts, events, decisions | MEMORY.md (OpenClaw native) |
| Daily work log | memory/YYYY-MM-DD.md |
| Current task + session state | SESSION-STATE.md |
| Corrections and mistakes | ~/self-improving/corrections.md |
| Confirmed preferences/rules | ~/self-improving/memory.md |
| Project-specific patterns | ~/self-improving/projects/{name}.md |
| Domain patterns (code, comms) | ~/self-improving/domains/{name}.md |

## WAL Protocol (Write-Ahead Log)

**Write state BEFORE responding.** If you crash/compact after responding but before saving, context is lost. WAL prevents this.

| Trigger | Write to | Then |
|---------|----------|------|
| User states preference | ~/self-improving/memory.md | Respond |
| User makes decision | SESSION-STATE.md | Respond |
| User corrects you | ~/self-improving/corrections.md | Respond |
| User gives deadline | SESSION-STATE.md | Respond |
| Significant task completed | memory/YYYY-MM-DD.md | Respond |

## SESSION-STATE.md (Hot RAM)

Lives in workspace root. Survives compaction, restarts, context loss. Read first every session, update every cycle.

```markdown
# SESSION-STATE.md — Active Working Memory

## Current Task
[What we're working on RIGHT NOW]

## Key Context
[Critical facts for current work]

## Pending Actions
- [ ] ...

## Recent Decisions
[Decisions made this session]

---
*Last updated: [timestamp]*
```

- **Session start:** Read SESSION-STATE.md first
- **During work:** Update before responding (WAL)
- **Session end:** Update with final state

## Learning Signals

**Log immediately** → corrections.md, evaluate for memory.md:
- "No, that's not right..." / "Actually, it should be..."
- "I prefer X, not Y" / "Remember that I always..."
- "Stop doing X" / "Why do you keep..."

**Log if explicit** → memory.md:
- "Always do X for me" / "Never do Y"
- "My style is..." / "For [project], use..."

**Track, promote after 3x:**
- Same instruction repeated 3+ times → ask to confirm as permanent rule
- Workflow that works well repeatedly
- User praises specific approach

**Ignore** (don't log):
- One-time instructions ("do X now")
- Context-specific ("in this file...")
- Hypotheticals ("what if...")
- Silence (absence of correction ≠ approval)

## Self-Reflection

After completing significant work, pause and evaluate:

1. **Did it meet expectations?** — Compare outcome vs intent
2. **What could be better?** — Identify improvements for next time
3. **Is this a pattern?** — If yes, log to corrections.md

```
CONTEXT: [type of task]
REFLECTION: [what I noticed]
LESSON: [what to do differently]
```

When to self-reflect: after multi-step tasks, after feedback, after fixing mistakes, when output could be better. Entries follow promotion rules: 3x applied successfully → promote to HOT.

## Tiered Memory

| Tier | Location | Limit | Behavior |
|------|----------|-------|----------|
| HOT | ~/self-improving/memory.md | ≤100 lines | Always loaded on session start |
| WARM | projects/, domains/ | ≤200 lines each | Load on context match |
| COLD | archive/ | Unlimited | Load on explicit query only |

### Promotion & Demotion
- Pattern used 3x in 7 days → promote to HOT
- Pattern unused 30 days → demote to WARM
- Pattern unused 90 days → archive to COLD
- **Never delete without asking user**

### Conflict Resolution
1. Most specific wins (project > domain > global)
2. Most recent wins (same level)
3. If ambiguous → ask user

## Workspace Integration (Non-Destructive)

**Never overwrite existing files.** Add sections, don't replace.

**SOUL.md** — add:
```markdown
**Self-Improving**
Before non-trivial work, load ~/self-improving/memory.md.
After corrections or reusable lessons, write one concise entry immediately.
Prefer learned rules when relevant. Keep self-inferred rules revisable.
```

**AGENTS.md** — add to Memory section:
```markdown
- **Self-improving:** ~/self-improving/ — execution-quality memory (preferences, patterns, corrections)
Use MEMORY.md / memory/ for factual continuity. Use ~/self-improving/ for compounding execution quality.
```

**HEARTBEAT.md** — add:
```markdown
## Self-Improving Check
- Read ./skills/self-improving/heartbeat-rules.md
- Use ~/self-improving/heartbeat-state.md for run markers
- If no file in ~/self-improving/ changed since last review, return HEARTBEAT_OK
```

## Quick Queries

| User says | Action |
|-----------|--------|
| "What do you know about X?" | Search all tiers for X |
| "What have you learned?" | Show last 10 from corrections.md |
| "Show my patterns" | List memory.md (HOT) |
| "Show [project] patterns" | Load projects/{name}.md |
| "Memory stats" | Show counts per tier |
| "Forget X" | Remove from all tiers (confirm first) |
| "Forget everything" | Export → wipe → confirm |

## Common Traps

| Trap | Why It Fails | Better Move |
|------|-------------|-------------|
| Learning from silence | Creates false rules | Wait for explicit correction or 3x evidence |
| Promoting too fast | Pollutes HOT memory | Keep tentative until confirmed |
| Reading every namespace | Wastes context | Load only HOT + smallest matching files |
| Compaction by deletion | Loses trust/history | Merge, summarize, or demote instead |
| Overwriting workspace files | Destroys existing context | Complement, never replace |

## Setup

If `~/self-improving/` does not exist, follow `setup.md`.

Quick init:
```bash
python3 ./skills/self-improving/scripts/agent_memory.py init
```

Status check:
```bash
python3 ./skills/self-improving/scripts/agent_memory.py status
```

## References

- **Learning mechanics**: See `references/learning.md` for trigger classification, confirmation flow, pattern evolution
- **Security boundaries**: See `references/boundaries.md` for what to never store, consent model, kill switch
- **Scaling rules**: See `references/scaling.md` for volume thresholds, compaction rules, multi-project patterns
- **Memory operations**: See `references/operations.md` for automatic operations, file formats, edge cases
- **Heartbeat rules**: See `heartbeat-rules.md` for recurring maintenance behavior

## Scope

This skill ONLY:
- Learns from user corrections and self-reflection
- Stores patterns in local files (~/self-improving/)
- Creates SESSION-STATE.md for session state management
- Maintains heartbeat state for recurring maintenance

This skill NEVER:
- Overwrites existing MEMORY.md, memory/, AGENTS.md, SOUL.md, HEARTBEAT.md
- Accesses calendar, email, contacts, or makes network requests
- Reads files outside ~/self-improving/ and workspace root
- Infers preferences from silence or observation
- Deletes memory without explicit user confirmation
- Modifies its own SKILL.md
