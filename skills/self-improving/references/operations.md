# Memory Operations

## Automatic Operations

### On Session Start
1. Read SESSION-STATE.md (workspace hot RAM)
2. Load ~/self-improving/memory.md (HOT tier)
3. Check index.md for context hints
4. If project detected → preload relevant namespace

### On Correction Received
1. Parse correction type (preference, pattern, override)
2. Check if duplicate (exists in any tier)
3. If new: add to corrections.md with timestamp, increment counter
4. If duplicate: bump counter, update timestamp; if ≥3 ask to confirm as rule
5. Determine namespace (global, domain, project)
6. Write to appropriate file (WAL: write BEFORE responding)
7. Update index.md line counts

### On Pattern Applied
1. Find pattern source (file:line)
2. Apply pattern
3. Cite source: "Using X (from memory.md:15)"
4. Log usage for decay tracking

### On Significant Work Completed
1. Self-reflect (outcome vs intent)
2. Log reflection if lesson found
3. Update SESSION-STATE.md
4. Update memory/YYYY-MM-DD.md daily log

## File Formats

### ~/self-improving/memory.md (HOT)
```markdown
# Self-Improving Memory (HOT)

## Confirmed Preferences
- format: bullet points over prose (confirmed 2026-01)
- tone: direct, no hedging (confirmed 2026-01)

## Active Patterns
- "looks good" = approval to proceed (used 15x)

## Recent (last 7 days)
- prefer SQLite for MVPs (corrected 02-14)
```

### ~/self-improving/corrections.md
```markdown
# Corrections Log

## 2026-02-15
- [14:32] Changed verbose explanation → bullet summary
  Type: communication | Context: Telegram response | Count: 1/3

## 2026-02-14
- [09:15] Use SQLite not Postgres for MVP
  Type: technical | Context: database discussion | Confirmed: yes
```

### ~/self-improving/projects/{name}.md
```markdown
# Project: my-app

Inherits: global, domains/code

## Patterns
- Use Tailwind (project standard)
- Deploy via GitLab CI

## Overrides
- semicolons: yes (overrides global no-semi)

## History
- Created: 2026-01-15
- Last active: 2026-02-15
```

## Edge Cases

### Contradiction Detected
Project overrides domain overrides global. Log conflict. Ask which should apply broadly.

### User Changes Mind
Archive old pattern with timestamp. Add new pattern as tentative. Keep archived for reference.

### Context Ambiguous
Check current context (project? domain?). If unclear, ask. Default to most specific active context.
