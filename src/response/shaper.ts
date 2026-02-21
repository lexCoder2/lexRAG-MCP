import {
  estimateTokens,
  makeBudget,
  type ResponseProfile,
} from "./budget.js";
import { TOOL_OUTPUT_SCHEMAS, applyFieldPriority } from "./schemas.js";

export interface ToolResponse {
  ok: boolean;
  profile: ResponseProfile;
  summary: string;
  data?: unknown;
  _tokenEstimate: number;
  hint?: string;
  errorCode?: string;
}

function truncateString(input: string, maxLength: number): string {
  if (!Number.isFinite(maxLength) || input.length <= maxLength) {
    return input;
  }
  return `${input.slice(0, maxLength)}…(truncated)`;
}

function shapeValue(value: unknown, profile: ResponseProfile, depth = 0): unknown {
  const maxDepth = profile === "debug" ? 20 : 6;
  const maxArray = profile === "balanced" ? 30 : profile === "debug" ? Number.POSITIVE_INFINITY : 10;
  const maxKeys = profile === "balanced" ? 50 : profile === "debug" ? Number.POSITIVE_INFINITY : 20;
  const maxStrLen = profile === "balanced" ? 4000 : profile === "debug" ? Number.POSITIVE_INFINITY : 1200;

  if (depth > maxDepth) {
    return "[…depth limit]";
  }

  if (typeof value === "string") {
    return truncateString(value, maxStrLen);
  }

  if (Array.isArray(value)) {
    const limited = value.slice(0, maxArray);
    const mapped = limited.map((item) => shapeValue(item, profile, depth + 1));
    if (value.length > maxArray) {
      mapped.push(`…${value.length - maxArray} more items`);
    }
    return mapped;
  }

  if (value !== null && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).slice(0, maxKeys);
    const shaped = Object.fromEntries(
      entries.map(([key, item]) => [key, shapeValue(item, profile, depth + 1)]),
    );
    const totalKeys = Object.keys(value as Record<string, unknown>).length;
    if (totalKeys > maxKeys) {
      (shaped as Record<string, unknown>)["…omitted"] = `${totalKeys - maxKeys} more keys`;
    }
    return shaped;
  }

  return value;
}

export function formatResponse(
  summary: string,
  data: unknown,
  profile: ResponseProfile = "compact",
  toolName?: string,
  hint?: string,
): ToolResponse {
  const budget = makeBudget(profile);
  let shaped = shapeValue(data, profile);

  if (
    profile !== "debug" &&
    toolName &&
    shaped !== null &&
    typeof shaped === "object" &&
    !Array.isArray(shaped)
  ) {
    const schema = TOOL_OUTPUT_SCHEMAS[toolName];
    if (schema?.length) {
      shaped = applyFieldPriority(
        shaped as Record<string, unknown>,
        schema,
        budget.maxTokens,
      );
    }
  }

  return {
    ok: true,
    profile,
    summary,
    data: shaped,
    _tokenEstimate: estimateTokens(shaped),
    ...(hint ? { hint } : {}),
  };
}

export function errorResponse(
  errorCode: string,
  reason: string,
  hint: string,
  profile: ResponseProfile = "compact",
): ToolResponse {
  return {
    ok: false,
    profile,
    summary: reason,
    _tokenEstimate: estimateTokens(reason),
    hint,
    errorCode,
  };
}
