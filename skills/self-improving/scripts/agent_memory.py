#!/usr/bin/env python3
"""
Agent Memory CLI — Self-improving + session state management.

Usage: agent_memory.py <command>

Commands:
  init     Initialize ~/self-improving/ + SESSION-STATE.md
  status   Check all memory layers
  today    Create today's daily log
  stats    Show memory statistics
"""

import os
import sys
from pathlib import Path
from datetime import datetime

HOME = Path.home()
SI_DIR = HOME / "self-improving"
WORKSPACE = Path.cwd()

MEMORY_HOT = """# Self-Improving Memory (HOT)

## Confirmed Preferences

## Active Patterns

## Recent (last 7 days)
"""

CORRECTIONS = """# Corrections Log

<!-- Format:
## YYYY-MM-DD
- [HH:MM] Changed X → Y | Type: format|technical|communication|project | Count: N/3
-->
"""

INDEX = """# Memory Index

## HOT
- memory.md: 0 lines

## WARM
- (no namespaces yet)

## COLD
- (no archives yet)

Last compaction: never
"""

HEARTBEAT_STATE = """# Self-Improving Heartbeat State

last_heartbeat_started_at: never
last_reviewed_change_at: never
last_heartbeat_result: never

## Last actions
- none yet
"""

SESSION_STATE = """# SESSION-STATE.md — Active Working Memory

## Current Task
[None]

## Key Context
[None yet]

## Pending Actions
- [ ] None

## Recent Decisions
[None yet]

---
*Last updated: {ts}*
"""

DAILY = """# {date} — Daily Log

## Tasks Completed
-{sp}

## Decisions Made
-{sp}

## Lessons Learned
-{sp}

## Tomorrow
-{sp}
"""


def _safe_create(path, content, label):
    """Create file only if it doesn't exist. Never overwrite."""
    if not path.exists():
        path.write_text(content)
        print(f"  ✅ Created {label}")
    else:
        print(f"  • {label} already exists")


def cmd_init():
    print("🧠 Initializing Agent Memory...\n")

    # Create ~/self-improving/ structure
    for d in ["projects", "domains", "archive"]:
        (SI_DIR / d).mkdir(parents=True, exist_ok=True)

    files = {
        "memory.md": MEMORY_HOT,
        "corrections.md": CORRECTIONS,
        "index.md": INDEX,
        "heartbeat-state.md": HEARTBEAT_STATE,
    }

    for name, content in files.items():
        _safe_create(SI_DIR / name, content, f"~/self-improving/{name}")

    # SESSION-STATE.md in workspace (never overwrite)
    ts = datetime.now().isoformat()
    _safe_create(
        WORKSPACE / "SESSION-STATE.md",
        SESSION_STATE.format(ts=ts),
        "SESSION-STATE.md"
    )

    # Today's daily log
    today = datetime.now().strftime("%Y-%m-%d")
    mem_dir = WORKSPACE / "memory"
    mem_dir.mkdir(exist_ok=True)
    _safe_create(
        mem_dir / f"{today}.md",
        DAILY.format(date=today, sp=" "),
        f"memory/{today}.md"
    )

    print("\n🎉 Agent Memory initialized!")
    print("\nNext: Update SOUL.md, AGENTS.md, HEARTBEAT.md (see setup.md)")


def cmd_status():
    print("📊 Agent Memory Status\n")

    # Self-improving files
    for f in ["memory.md", "corrections.md", "index.md", "heartbeat-state.md"]:
        p = SI_DIR / f
        if p.exists():
            lines = p.read_text().count("\n")
            kb = p.stat().st_size / 1024
            print(f"  ✅ ~/self-improving/{f} ({lines} lines, {kb:.1f}KB)")
        else:
            print(f"  ❌ ~/self-improving/{f} missing")

    # Directories
    for d in ["projects", "domains", "archive"]:
        p = SI_DIR / d
        if p.exists():
            count = len(list(p.glob("*.md")))
            print(f"  ✅ ~/self-improving/{d}/ ({count} files)")
        else:
            print(f"  ❌ ~/self-improving/{d}/ missing")

    # Workspace files
    print()
    for name, label in [
        ("SESSION-STATE.md", "SESSION-STATE.md"),
        ("MEMORY.md", "MEMORY.md (OpenClaw native)"),
    ]:
        p = WORKSPACE / name
        if p.exists():
            kb = p.stat().st_size / 1024
            print(f"  ✅ {label} ({kb:.1f}KB)")
        else:
            print(f"  ❌ {label} missing")

    mem = WORKSPACE / "memory"
    if mem.exists():
        count = len(list(mem.glob("*.md")))
        print(f"  ✅ memory/ ({count} daily logs)")
    else:
        print(f"  ❌ memory/ missing")


def cmd_today():
    today = datetime.now().strftime("%Y-%m-%d")
    mem_dir = WORKSPACE / "memory"
    mem_dir.mkdir(exist_ok=True)
    _safe_create(
        mem_dir / f"{today}.md",
        DAILY.format(date=today, sp=" "),
        f"memory/{today}.md"
    )


def cmd_stats():
    print("📊 Agent Memory Stats\n")

    # HOT
    hot = SI_DIR / "memory.md"
    hot_lines = hot.read_text().count("\n") if hot.exists() else 0
    print(f"🔥 HOT (always loaded):")
    print(f"   memory.md: {hot_lines} lines (limit: 100)\n")

    # WARM
    print(f"🌡️  WARM (load on demand):")
    for d in ["projects", "domains"]:
        p = SI_DIR / d
        if p.exists():
            files = list(p.glob("*.md"))
            print(f"   {d}/: {len(files)} files")
            for f in files:
                print(f"     - {f.name} ({f.read_text().count(chr(10))} lines)")
        else:
            print(f"   {d}/: 0 files")

    # COLD
    archive = SI_DIR / "archive"
    count = len(list(archive.glob("*.md"))) if archive.exists() else 0
    print(f"\n❄️  COLD (archived):")
    print(f"   archive/: {count} files")

    # Corrections count
    corr = SI_DIR / "corrections.md"
    if corr.exists():
        entries = sum(1 for l in corr.read_text().split("\n") if l.strip().startswith("- ["))
        print(f"\n📝 Corrections logged: {entries}")

    # Workspace
    print(f"\n📁 Workspace:")
    mm = WORKSPACE / "MEMORY.md"
    if mm.exists():
        print(f"   MEMORY.md: {mm.read_text().count(chr(10))} lines")
    mem = WORKSPACE / "memory"
    if mem.exists():
        print(f"   Daily logs: {len(list(mem.glob('*.md')))}")
    ss = WORKSPACE / "SESSION-STATE.md"
    if ss.exists():
        print(f"   SESSION-STATE.md: active")


def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else "help"
    cmds = {"init": cmd_init, "status": cmd_status, "today": cmd_today, "stats": cmd_stats}
    if cmd in cmds:
        cmds[cmd]()
    else:
        print(__doc__)


if __name__ == "__main__":
    main()
