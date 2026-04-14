import { addDays, addMonths, addWeeks, addYears, formatISO } from "date-fns";

export function nextOccurrence(baseDate: string, recurrence: string) {
  const date = new Date(baseDate);

  switch (recurrence) {
    case "every_day":
      return formatISO(addDays(date, 1), { representation: "date" });
    case "every_week":
      return formatISO(addWeeks(date, 1), { representation: "date" });
    case "every_weekday": {
      const next = addDays(date, 1);
      if (next.getDay() === 6) return formatISO(addDays(next, 2), { representation: "date" });
      if (next.getDay() === 0) return formatISO(addDays(next, 1), { representation: "date" });
      return formatISO(next, { representation: "date" });
    }
    case "every_month":
      return formatISO(addMonths(date, 1), { representation: "date" });
    case "every_year":
      return formatISO(addYears(date, 1), { representation: "date" });
    default:
      return baseDate;
  }
}
