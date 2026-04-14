"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body>
        <div className="m-8 rounded-xl border border-rose-300 p-6 text-sm">
          <h2 className="text-lg font-semibold">Unexpected app error</h2>
          <button onClick={reset} className="mt-3 rounded bg-rose-600 px-3 py-2 text-white">Retry</button>
        </div>
      </body>
    </html>
  );
}
