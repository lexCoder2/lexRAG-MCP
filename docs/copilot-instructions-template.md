# Copilot Instructions - lxRAG MCP Server (Template)

**Copy this to `.github/copilot-instructions.md` and customize for your project.**

---

## 🎯 Core Rules

1. **Use MCP tools** for all code intelligence — never read files directly
2. **Initialize first**: Call `graph_set_workspace(workspaceRoot, projectId)` then `graph_health()`
3. **Re-anchor regularly**: Call `graph_health()` every 5 messages to prevent drift

---

## 📊 Tool Quick Reference

| Question       | Tool                             | Example                  |
| -------------- | -------------------------------- | ------------------------ |
| Find code      | `graph_query`                    | "find all HTTP handlers" |
| Understand     | `code_explain`                   | Symbol or class name     |
| Impact         | `impact_analyze`                 | Changed file paths       |
| Which tests    | `test_select`                    | Changed file paths       |
| Search concept | `semantic_search`                | "validation patterns"    |
| Architecture   | `arch_validate` / `arch_suggest` | File path                |
| Remember       | `episode_add`                    | Important decision       |

**Full reference**: [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) (38 tools)

---

## 🔄 Session Flow

**First message (required):**

```json
{
  "tool": "graph_set_workspace",
  "args": {
    "workspaceRoot": "/path/to/project",
    "projectId": "project-id",
    "sourceDir": "src"
  }
}
```

Then call `graph_health()` and proceed.

**Every 5th message**: Re-anchor with `graph_health()`.

---

## 📋 Your Project

- **Project**: [YOUR_PROJECT_NAME]
- **Workspace**: [YOUR_WORKSPACE_PATH]
- **Project ID**: [YOUR_PROJECT_ID]

---

## 📚 Need Help?

- [MCP Integration Guide](./docs/MCP_INTEGRATION_GUIDE.md)
- [Tool Patterns](./docs/TOOL_PATTERNS.md)
- [Architecture](./ARCHITECTURE.md)
- [Quick Reference](./QUICK_REFERENCE.md)
