/**
 * Architecture Validation Tools
 * Phase 5 Step 3: Extract architecture validation tools
 *
 * Tools:
 * - arch_validate: validate code against architecture rules
 * - arch_suggest: suggest appropriate layer for code
 *
 * These tools delegate entirely to the ArchitectureEngine.
 */

/**
 * Minimal context interface required by arch tools
 */
interface ArchToolContext {
  archEngine?: any; // ArchitectureEngine
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
 * Create architecture validation tools
 * @param ctx - Context object providing archEngine and formatting methods
 */
export function createArchTools(ctx: ArchToolContext) {
  return {
    /**
     * Validate code files against architecture rules
     */
    async arch_validate(args: any): Promise<string> {
      const { files, strict = false, profile = "compact" } = args;

      if (!ctx.archEngine) {
        return ctx.errorEnvelope(
          "ARCH_ENGINE_UNAVAILABLE",
          "Architecture engine not initialized",
          true
        );
      }

      try {
        const result = await ctx.archEngine.validate(files);

        const output = {
          success: result.success,
          violations: result.violations.slice(0, 20), // Top 20 violations
          statistics: result.statistics,
          severity: strict ? "error" : "warning",
        };

        return ctx.formatSuccess(output, profile);
      } catch (error) {
        return ctx.errorEnvelope(
          "ARCH_VALIDATE_FAILED",
          String(error),
          true
        );
      }
    },

    /**
     * Suggest appropriate layer for given code
     */
    async arch_suggest(args: any): Promise<string> {
      const { name, type, dependencies = [], profile = "compact" } = args;

      if (!ctx.archEngine) {
        return ctx.errorEnvelope(
          "ARCH_ENGINE_UNAVAILABLE",
          "Architecture engine not initialized",
          true
        );
      }

      try {
        const suggestion = ctx.archEngine.getSuggestion(
          name,
          type,
          dependencies
        );

        if (!suggestion) {
          return ctx.formatSuccess(
            {
              success: false,
              message: "No suitable layer found for this code",
              reason: `No layer can import from all dependencies: ${dependencies.join(", ")}`,
            },
            profile
          );
        }

        return ctx.formatSuccess(
          {
            success: true,
            suggestedLayer: suggestion.suggestedLayer,
            suggestedPath: suggestion.suggestedPath,
            reasoning: suggestion.reasoning,
          },
          profile
        );
      } catch (error) {
        return ctx.errorEnvelope("ARCH_SUGGEST_FAILED", String(error), true);
      }
    },
  };
}
