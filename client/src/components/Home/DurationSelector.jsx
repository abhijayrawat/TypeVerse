const DURATIONS = [15, 30, 60];
const WORD_COUNTS = [10, 25, 50, 100];

export default function DurationSelector({
  mode,
  testDuration,
  wordTarget,
  skipSpaces,
  setSkipSpaces,
  started,
  restart,
}) {
  return mode === "time" ? (
    <div className="flex gap-4 mb-6 items-center">
      {DURATIONS.map((d) => (
        <button
          key={d}
          disabled={started}
          onClick={() => restart(d, undefined)}
          className={`px-4 py-2 font-semibold rounded-full transition focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ${
            testDuration === d ? "bg-yellow-500 text-black shadow-lg scale-110" : "bg-zinc-800 hover:bg-zinc-700"
          }`}
        >
          {d}s
        </button>
      ))}

      <button
        disabled={started}
        onClick={() => {
          setSkipSpaces(!skipSpaces);
          restart(testDuration, wordTarget);
        }}
        className={`px-3 py-1 ml-4 font-semibold rounded-full transition focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ${
          skipSpaces ? "bg-yellow-400 text-black" : "bg-zinc-700 text-zinc-300 hover:bg-yellow-500 hover:text-black"
        }`}
        title={skipSpaces ? "Auto-skip spaces Enabled" : "Auto-skip spaces Disabled"}
      >
        {skipSpaces ? "Skip Spaces ✓" : "Type Spaces"}
      </button>
    </div>
  ) : (
    <div className="flex gap-4 mb-6 items-center">
      {WORD_COUNTS.map((count) => (
        <button
          key={count}
          disabled={started}
          onClick={() => restart(undefined, count)}
          className={`px-4 py-2 font-semibold rounded-full transition focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ${
            wordTarget === count ? "bg-yellow-500 text-black shadow-lg scale-110" : "bg-zinc-800 hover:bg-zinc-700"
          }`}
        >
          {count} Words
        </button>
      ))}

      <button
        disabled={started}
        onClick={() => {
          setSkipSpaces(!skipSpaces);
          restart(undefined, wordTarget);
        }}
        className={`px-3 py-1 ml-4 font-semibold rounded-full transition focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ${
          skipSpaces ? "bg-yellow-400 text-black" : "bg-zinc-700 text-zinc-300 hover:bg-yellow-500 hover:text-black"
        }`}
        title={skipSpaces ? "Auto-skip spaces Enabled" : "Auto-skip spaces Disabled"}
      >
        {skipSpaces ? "Skip Spaces ✓" : "Type Spaces"}
      </button>
    </div>
  );
}
