export interface SchedulingSuggestion {
  suggestedDate: string;
  reason: string;
}

export interface ScheduleSuggester {
  suggest(taskTitle: string, estimateMinutes: number): Promise<SchedulingSuggestion[]>;
}

export const noopScheduleSuggester: ScheduleSuggester = {
  async suggest() {
    return [];
  },
};
