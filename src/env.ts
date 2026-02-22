/**
 * Centralized environment configuration.
 *
 * This is the ONLY place in the codebase that reads `process.env`.
 * Every other module imports the constants it needs from here.
 *
 * Copy `.env.example` to `.env` and adjust the values for your setup.
 */

import * as dotenv from "dotenv";
import * as path from "path";

// Load .env file as early as possible so all subsequent reads see the values.
dotenv.config();

// ── Workspace / Project ───────────────────────────────────────────────────────

/**
 * Absolute path to the workspace being indexed.
 * Env: LEXRAG_WORKSPACE_ROOT
 * Default: process.cwd()
 */
export const LEXRAG_WORKSPACE_ROOT: string = path.resolve(
  process.env.LEXRAG_WORKSPACE_ROOT || process.cwd(),
);

// Alias for backward compatibility
export const CODE_GRAPH_WORKSPACE_ROOT = LEXRAG_WORKSPACE_ROOT;

/**
 * Source sub-directory to index. Can be absolute or relative to WORKSPACE_ROOT.
 * Env: GRAPH_SOURCE_DIR
 * Default: <WORKSPACE_ROOT>/src
 */
export const GRAPH_SOURCE_DIR: string = (() => {
  const raw =
    process.env.GRAPH_SOURCE_DIR || path.join(LEXRAG_WORKSPACE_ROOT, "src");
  return path.isAbsolute(raw) ? raw : path.resolve(LEXRAG_WORKSPACE_ROOT, raw);
})();

/**
 * Logical project identifier used as a namespace in the graph.
 * Env: LEXRAG_PROJECT_ID
 * Default: basename of LEXRAG_WORKSPACE_ROOT
 */
export const LEXRAG_PROJECT_ID: string =
  process.env.LEXRAG_PROJECT_ID || path.basename(LEXRAG_WORKSPACE_ROOT);

// Alias for backward compatibility
export const CODE_GRAPH_PROJECT_ID = LEXRAG_PROJECT_ID;

/**
 * Transaction ID for graph write operations.
 * Env: LEXRAG_TX_ID
 * Default: undefined (callers generate a fresh `tx-<timestamp>` per invocation)
 */
export const LEXRAG_TX_ID: string | undefined =
  process.env.LEXRAG_TX_ID || undefined;

// ── MCP Transport ─────────────────────────────────────────────────────────────

/**
 * Transport mode for the MCP server.
 * Env: MCP_TRANSPORT
 * Default: "stdio"
 */
export const MCP_TRANSPORT: "stdio" | "http" =
  (process.env.MCP_TRANSPORT as "stdio" | "http") || "stdio";

/**
 * HTTP port when MCP_TRANSPORT=http.
 * Env: MCP_PORT
 * Default: 9000
 */
export const MCP_PORT: number = parseInt(process.env.MCP_PORT || "9000", 10);

/**
 * Display name reported by the MCP server.
 * Env: LEXRAG_SERVER_NAME
 * Default: "lexRAG MCP"
 */
export const LEXRAG_SERVER_NAME: string =
  process.env.LEXRAG_SERVER_NAME || "lexRAG MCP";

// Alias for backward compatibility
export const CODE_GRAPH_SERVER_NAME = LEXRAG_SERVER_NAME;

// ── Memgraph (graph database) ─────────────────────────────────────────────────

/**
 * Hostname of the Memgraph instance.
 * Env: MEMGRAPH_HOST
 * Default: "localhost"
 */
export const MEMGRAPH_HOST: string = process.env.MEMGRAPH_HOST || "localhost";

/**
 * Bolt port of the Memgraph instance.
 * Env: MEMGRAPH_PORT
 * Default: 7687
 */
export const MEMGRAPH_PORT: number = parseInt(
  process.env.MEMGRAPH_PORT || "7687",
  10,
);

// ── Qdrant (vector store) ─────────────────────────────────────────────────────

/**
 * Hostname of the Qdrant instance.
 * Env: QDRANT_HOST
 * Default: "localhost"
 */
export const QDRANT_HOST: string = process.env.QDRANT_HOST || "localhost";

/**
 * REST port of the Qdrant instance.
 * Env: QDRANT_PORT
 * Default: 6333
 */
export const QDRANT_PORT: number = parseInt(
  process.env.QDRANT_PORT || "6333",
  10,
);

// ── Code Summarizer ───────────────────────────────────────────────────────────

/**
 * URL of the optional LLM summarizer service (e.g. http://localhost:8080).
 * When undefined, summarization is disabled and heuristic summaries are used.
 * Env: LEXRAG_SUMMARIZER_URL
 */
export const LEXRAG_SUMMARIZER_URL: string | undefined =
  process.env.LEXRAG_SUMMARIZER_URL || undefined;

// Alias for backward compatibility
export const CODE_GRAPH_SUMMARIZER_URL = LEXRAG_SUMMARIZER_URL;

// ── Agent / Coordination ──────────────────────────────────────────────────────

/**
 * Identifier for the current agent instance used in coordination claims.
 * Env: LEXRAG_AGENT_ID
 * Default: "agent-local"
 */
export const LEXRAG_AGENT_ID: string =
  process.env.LEXRAG_AGENT_ID || "agent-local";

// Alias for backward compatibility
export const CODE_GRAPH_AGENT_ID = LEXRAG_AGENT_ID;

// ── Parser ────────────────────────────────────────────────────────────────────

/**
 * Set to true to use the Tree-sitter parser instead of the regex parser.
 * Env: LEXRAG_USE_TREE_SITTER
 * Default: false
 */
export const LEXRAG_USE_TREE_SITTER: boolean =
  process.env.LEXRAG_USE_TREE_SITTER === "true";

// Alias for backward compatibility
export const CODE_GRAPH_USE_TREE_SITTER = LEXRAG_USE_TREE_SITTER;

// ── File Watcher ──────────────────────────────────────────────────────────────

/**
 * Enables incremental file-change watching.
 * Automatically considered true when MCP_TRANSPORT=http.
 * Env: LEXRAG_ENABLE_WATCHER
 * Default: false
 */
export const LEXRAG_ENABLE_WATCHER: boolean =
  process.env.LEXRAG_ENABLE_WATCHER === "true";

// Alias for backward compatibility
export const CODE_GRAPH_ENABLE_WATCHER = LEXRAG_ENABLE_WATCHER;

/**
 * Comma-separated glob patterns to exclude from indexing/watching.
 * Env: LEXRAG_IGNORE_PATTERNS
 * Example: "node_modules/**,dist/**,.git/**"
 */
export const LEXRAG_IGNORE_PATTERNS: string[] = (
  process.env.LEXRAG_IGNORE_PATTERNS || ""
)
  .split(",")
  .map((p) => p.trim())
  .filter(Boolean);

// Alias for backward compatibility
export const CODE_GRAPH_IGNORE_PATTERNS = LEXRAG_IGNORE_PATTERNS;

// ── Path Fallback ─────────────────────────────────────────────────────────────

/**
 * Allow the server to fall back to the mounted workspace path when the
 * requested path is not accessible (useful inside Docker containers).
 * Env: LEXRAG_ALLOW_RUNTIME_PATH_FALLBACK
 * Default: false
 */
export const LEXRAG_ALLOW_RUNTIME_PATH_FALLBACK: boolean =
  process.env.LEXRAG_ALLOW_RUNTIME_PATH_FALLBACK === "true";

// Alias for backward compatibility
export const CODE_GRAPH_ALLOW_RUNTIME_PATH_FALLBACK =
  LEXRAG_ALLOW_RUNTIME_PATH_FALLBACK;
