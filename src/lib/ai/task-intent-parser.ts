export interface ParsedTaskIntent {
  title: string;
  scheduledDate?: string;
  inferredTime?: string;
}

export interface TaskIntentParser {
  parse(input: string): Promise<ParsedTaskIntent | null>;
}

export const noopTaskIntentParser: TaskIntentParser = {
  async parse() {
    return null;
  },
};
