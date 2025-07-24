export default function FinishedSummary({ stats, mode, testDuration, timeLeft, wordList }) {
  return (
    <div className="mt-6 border border-yellow-500 p-4 rounded text-center font-mono">
      <p>
        WPM: <strong>{stats.wpm}</strong> | Accuracy: <strong>{stats.accuracy}%</strong>{" "}
        {mode === "words" && `| Words: ${wordList.length}`}
      </p>
      <p className="italic text-sm mt-1">
        Test completed in{" "}
        {mode === "time" ? `${testDuration - timeLeft} seconds` : "all words typed"}.
      </p>
    </div>
  );
}
