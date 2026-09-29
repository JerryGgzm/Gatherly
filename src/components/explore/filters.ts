import type { BudgetId, LocationId, ThemeId } from "@/lib/data";

export type Filters = {
  nights: string[];
  areas: LocationId[];
  themes: ThemeId[];
  budgets: BudgetId[];
};

export const EMPTY_FILTERS: Filters = { nights: [], areas: [], themes: [], budgets: [] };

export const MAX_THEMES = 3;
