/**
 * Documentation Tools
 * Phase 5 Step 4: Extract documentation indexing and search tools
 *
 * Tools:
 * - index_docs: index documentation files in workspace
 * - search_docs: search indexed documentation
 *
 * These tools delegate entirely to the DocsEngine.
 */

/**
 * Minimal context interface required by docs tools
 */
interface DocsToolContext {
  docsEngine?: any; // DocsEngine
  resolveProjectContext(overrides?: any): { workspaceRoot: string; projectId: string };
  errorEnvelope(
    code: string,
    reason: string,
    recoverable?: boolean,
    hint?: string
  ): string;
  formatSuccess(
    data: unknown,
    profile?: string,
    summary?: string,
    toolName?: string
  ): string;
}

/**
 * Create documentation tools
 * @param ctx - Context object providing docsEngine and helper methods
 */
export function createDocsTools(ctx: DocsToolContext) {
  return {
    /**
     * Index documentation files in a workspace
     */
    async index_docs(args: any): Promise<string> {
      const {
        workspaceRoot: argsRoot,
        projectId: argsProject,
        incremental = true,
        withEmbeddings = false,
      } = args ?? {};
      try {
        const { workspaceRoot, projectId } = ctx.resolveProjectContext({
          workspaceRoot: argsRoot,
          projectId: argsProject,
        });
        if (!ctx.docsEngine) {
          return ctx.errorEnvelope(
            "ENGINE_UNAVAILABLE",
            "DocsEngine not initialised",
            false
          );
        }
        const result = await ctx.docsEngine.indexWorkspace(
          workspaceRoot,
          projectId,
          {
            incremental,
            withEmbeddings,
          }
        );
        return ctx.formatSuccess(
          {
            ok: true,
            indexed: result.indexed,
            skipped: result.skipped,
            errorCount: result.errors.length,
            errors: result.errors.slice(0, 10),
            durationMs: result.durationMs,
            projectId,
            workspaceRoot,
          },
          "compact"
        );
      } catch (err) {
        return ctx.errorEnvelope(
          "INDEX_DOCS_ERROR",
          err instanceof Error ? err.message : String(err),
          true
        );
      }
    },

    /**
     * Search indexed documentation
     */
    async search_docs(args: any): Promise<string> {
      const {
        query,
        symbol,
        limit = 10,
        projectId: argsProject,
      } = args ?? {};
      try {
        const { projectId } = ctx.resolveProjectContext({
          projectId: argsProject,
        });
        if (!ctx.docsEngine) {
          return ctx.errorEnvelope(
            "ENGINE_UNAVAILABLE",
            "DocsEngine not initialised",
            false
          );
        }
        let results;
        if (typeof symbol === "string" && symbol.trim().length > 0) {
          results = await ctx.docsEngine.getDocsBySymbol(
            symbol.trim(),
            projectId,
            { limit }
          );
        } else if (typeof query === "string" && query.trim().length > 0) {
          results = await ctx.docsEngine.searchDocs(
            query.trim(),
            projectId,
            {
              limit,
            }
          );
        } else {
          return ctx.errorEnvelope(
            "MISSING_PARAM",
            "Provide either `query` (full-text search) or `symbol` (symbol lookup)",
            true
          );
        }
        return ctx.formatSuccess(
          {
            ok: true,
            count: results.length,
            results: results.map((r: any) => ({
              heading: r.heading,
              doc: r.docRelativePath,
              kind: r.kind,
              startLine: r.startLine,
              score: r.score,
              excerpt: r.content.slice(0, 200),
            })),
            projectId,
          },
          "compact"
        );
      } catch (err) {
        return ctx.errorEnvelope(
          "SEARCH_DOCS_ERROR",
          err instanceof Error ? err.message : String(err),
          true
        );
      }
    },
  };
}
