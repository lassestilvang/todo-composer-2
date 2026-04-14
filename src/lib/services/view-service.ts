import { addDays, formatISO, startOfDay } from "date-fns";

export function getDateRangeForView(view: "today" | "next-7-days" | "upcoming" | "all") {
  const today = startOfDay(new Date());
  const start = formatISO(today, { representation: "date" });

  if (view === "today") {
    return { start, end: start };
  }

  if (view === "next-7-days") {
    return { start, end: formatISO(addDays(today, 7), { representation: "date" }) };
  }

  if (view === "upcoming") {
    return { start, end: null };
  }

  return { start: null, end: null };
}
