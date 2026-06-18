---
name: linear-scribe
description: "Trigger: save to Linear, linear issue, create ticket, update ticket, linear subtask, save SDD to linear. Delegate ALL Linear MCP operations to keep main context clean."
license: MIT
metadata:
  author: gentle-ai
  version: "1.0"
---

## Purpose

Thin wrapper for ALL Linear MCP operations. The orchestrator delegates here instead of calling Linear directly. This keeps the main conversation context clean.

## Rules

- ALL Linear MCP calls go through this skill. Never call Linear directly from the orchestrator.
- Return ONLY: issue ID, title, URL, and one-line status. No full API responses.
- If an operation fails, return the error and suggest a manual fix.

## Available operations

### Create issue
```
linear_save_issue(title, description, team, project, priority, estimate, parentId, labels)
```

### Update issue
```
linear_save_issue(id, title, description, priority, state, estimate, labels, parentId)
```

### List issues
```
linear_list_issues(team, project, limit)
```

### Get issue
```
linear_get_issue(id)
```

### Add comment
```
linear_save_comment(issueId, body)
```

### Create label
```
linear_create_issue_label(name, description, color, teamId)
```

## Return format

Always return a compact summary:

```
✅ Created EZE-240: "Spec — Pantalla Comunidades"
   URL: https://linear.app/eze33/issue/EZE-240
   Project: Gestoria | Priority: High | Estimate: 30pts
```

Or on error:

```
❌ Failed to create issue: {error}
   Suggestion: {manual fix}
```

## Integration with SDD phases

When the orchestrator completes an SDD phase and wants to save to Linear, it passes:
1. The phase output (executive summary, artifacts, decisions)
2. The target issue ID (or "create new")
3. The action (create, update, add comment, add subtask)

This skill formats and executes the Linear call, then returns the compact summary.
