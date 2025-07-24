import React from "react";

const FilterControls = React.memo(function FilterControls({
  timeFilter,
  setTimeFilter,
  modeFilter,
  setModeFilter,
  clearTests,
  clearLoading,
  TIMEFRAMES,
  MODES,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-4">
      <h2 className="text-xl font-bold">Test History</h2>

      <div className="flex flex-wrap items-center gap-3">
        <select
          aria-label="Filter test history by time"
          className="bg-zinc-800 text-white rounded py-1 px-3 font-mono focus:outline-none focus:ring-2 focus:ring-yellow-400"
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
        >
          {TIMEFRAMES.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter test history by mode"
          className="bg-zinc-800 text-white rounded py-1 px-3 font-mono focus:outline-none focus:ring-2 focus:ring-yellow-400"
          value={modeFilter}
          onChange={(e) => setModeFilter(e.target.value)}
        >
          {MODES.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <button
          disabled={clearLoading}
          onClick={() => clearTests({ timeFrame: timeFilter, mode: modeFilter, limit: 5 })}
          className="px-4 py-1 font-semibold rounded bg-red-600 hover:bg-red-700 disabled:opacity-50 transition focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Clear Last 5
        </button>

        <button
          disabled={clearLoading}
          onClick={() => clearTests({ timeFrame: timeFilter, mode: modeFilter })}
          className="px-4 py-1 font-semibold rounded bg-red-600 hover:bg-red-700 disabled:opacity-50 transition focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Clear All
        </button>
      </div>
    </div>
  );
});

export default FilterControls;
