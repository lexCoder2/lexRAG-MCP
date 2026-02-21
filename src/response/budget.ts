export type ResponseProfile = "compact" | "balanced" | "debug";

export const DEFAULT_TOKEN_BUDGETS: Record<ResponseProfile, number> = {
  compact: 300,
  balanced: 1200,
  debug: Number.POSITIVE_INFINITY,
};

export interface BudgetAllocation {
  coreCode: number;
  dependencies: number;
  decisions: number;
  plan: number;
  episodeHistory: number;
}

export interface ContextBudget {
  maxTokens: number;
  profile: ResponseProfile;
  allocation: BudgetAllocation;
}

const DEFAULT_ALLOCATION: BudgetAllocation = {
  coreCode: 0.4,
  dependencies: 0.25,
  decisions: 0.2,
  plan: 0.1,
  episodeHistory: 0.05,
};

export function makeBudget(
  profile: ResponseProfile,
  override?: Partial<ContextBudget>,
): ContextBudget {
  return {
    maxTokens: override?.maxTokens ?? DEFAULT_TOKEN_BUDGETS[profile],
    profile,
    allocation: override?.allocation ?? DEFAULT_ALLOCATION,
  };
}

export function estimateTokens(value: unknown): number {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return Math.ceil(text.length / 4);
}

export function fillSlot<T>(
  items: T[],
  tokenFn: (item: T) => number,
  slotBudget: number,
): { selected: T[]; usedTokens: number } {
  let usedTokens = 0;
  const selected: T[] = [];

  for (const item of items) {
    const itemCost = tokenFn(item);
    if (usedTokens + itemCost > slotBudget) {
      continue;
    }

    selected.push(item);
    usedTokens += itemCost;
  }

  return { selected, usedTokens };
}
