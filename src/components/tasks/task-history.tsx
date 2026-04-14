type HistoryRecord = {
  id: string;
  action: string;
  field: string | null;
  before: string | null;
  after: string | null;
  created_at: string;
};

export function TaskHistory({ history }: { history: HistoryRecord[] }) {
  return (
    <div className="space-y-2 rounded-xl border border-zinc-200 p-3 dark:border-zinc-700">
      <h3 className="text-sm font-medium">Change history</h3>
      <ul className="space-y-2 text-xs text-zinc-500">
        {history.map((entry) => (
          <li key={entry.id} className="rounded bg-zinc-100 p-2 dark:bg-zinc-800">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">{entry.action}</span>
            {entry.field ? ` (${entry.field})` : ""} - {new Date(entry.created_at).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
