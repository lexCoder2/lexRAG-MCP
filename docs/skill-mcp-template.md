---
name: lx
description: Use lxRAG-MCP code graph tools to explore the codebase, assess change impact, validate architecture, and recall past decisions.
argument-hint: "task description or file path"
---

# lxRAG-MCP Code Graph Analysis

## Session Init (required once per session)

```
graph_set_workspace(workspaceRoot, projectId, sourceDir)
graph_health()
```

Re-anchor every 5 messages: `graph_health()`

---

## Tool Reference

| Goal | Tool | Input |
|---|---|---|
| Find code | `graph_query` | pattern string |
| Search concept | `semantic_search` | concept string |
| Understand code | `code_explain` | symbol / file |
| Find usages | `usages` | symbol / file |
| Change impact | `impact_analyze` | file list |
| Relevant tests | `test_select` | file list |
| Validate design | `arch_validate` | file / path |
| Suggest design | `arch_suggest` | context |
| Save decision | `episode_add` | key + payload |
| Recall decision | `episode_query` | topic string |

---

## Workflows

**Before any change:**
1. `graph_health()` — verify sync
2. `impact_analyze(files)` — see scope
3. `test_select(files)` — know which tests to run

**Exploring unknown code:**
1. `graph_query("describe what you're looking for")`
2. `code_explain(match)` — understand implementation
3. `usages(match)` — see dependencies

**Architecture decision:**
1. `arch_suggest(context)` — get options
2. `arch_validate(files)` — confirm alignment
3. `episode_add(decision, rationale)` — persist choice

---

## Rules

- Never read files directly — always use MCP tools
- Always init with `graph_set_workspace` + `graph_health` first
- Run `impact_analyze` before modifying files
- Store non-obvious decisions with `episode_add`
