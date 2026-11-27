#!/usr/bin/env python3
"""
gemini-breakdown.py — CLI script to test Gemini 2.5 Flash Goal -> Task -> Micro-Step
decomposition from the terminal (uses GEMINI_API_KEY / VITE_GEMINI_API_KEY or deterministic fallback).
"""

import json
import os
import sys
import urllib.request

GOAL_PROMPT = " ".join(sys.argv[1:]) if len(sys.argv) > 1 else "Launch Mindset Machine Android APK with Google Fit & Drive Sync"


def main() -> int:
    api_key = os.environ.get("VITE_GEMINI_API_KEY") or os.environ.get("GEMINI_API_KEY") or ""
    print(f"=== Mindset Machine — Gemini 2.5 Flash Task & Micro-Step Architect ===")
    print(f"Target Goal: {GOAL_PROMPT}")

    if api_key:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
        body = {
            "contents": [
                {
                    "role": "user",
                    "parts": [
                        {
                            "text": (
                                f"Break down the goal '{GOAL_PROMPT}' into 3 tasks with 3 micro-tasks each. "
                                "Return JSON with goalTitle, category, tasks[{taskTitle, priority, energy, microTasks[{title, estimatedMinutes}]}]."
                            )
                        }
                    ],
                }
            ],
            "generationConfig": {"responseMimeType": "application/json"},
        }
        try:
            req = urllib.request.Request(
                url, data=json.dumps(body).encode("utf-8"), headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                print(json.dumps(json.loads(text), indent=2))
                return 0
        except Exception as exc:
            print(f"[WARN] Live Gemini API call fell back to offline heuristic: {exc}")

    fallback = {
        "goalTitle": GOAL_PROMPT,
        "category": "quarterly",
        "tasks": [
            {
                "taskTitle": f"Phase 1: Architecture & Scope for {GOAL_PROMPT}",
                "priority": "high",
                "energy": "deep",
                "microTasks": [
                    {"title": "Define minimal Drive schema & OAuth scopes", "estimatedMinutes": 15},
                    {"title": "Lock 90m circadian deep-work focus block", "estimatedMinutes": 10},
                ],
            },
            {
                "taskTitle": f"Phase 2: Core Implementation — {GOAL_PROMPT}",
                "priority": "high",
                "energy": "deep",
                "microTasks": [
                    {"title": "Build & verify Zuari 5-Plane UI components", "estimatedMinutes": 30},
                    {"title": "Run vitest & Capacitor Android sync", "estimatedMinutes": 15},
                ],
            },
        ],
    }
    print(json.dumps(fallback, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
