import React from "react";

const TestHistoryTable = React.memo(function TestHistoryTable({ history }) {
  if (history.length === 0) {
    return <p className="text-zinc-400">No tests taken yet.</p>;
  }

  return (
    <table className="w-full bg-zinc-800 rounded shadow mb-8">
      <thead>
        <tr>
          <th className="p-2 text-left">Date</th>
          <th className="p-2 text-left">WPM</th>
          <th className="p-2 text-left">Accuracy</th>
          <th className="p-2 text-left">Time (s)</th>
          <th className="p-2 text-left">Mode</th>
        </tr>
      </thead>
      <tbody>
        {history.map((test, idx) => (
          <tr key={test._id || idx} className="hover:bg-zinc-700">
            <td className="p-2">{new Date(test.date).toLocaleString()}</td>
            <td className="p-2">{test.wpm}</td>
            <td className="p-2">{test.accuracy}%</td>
            <td className="p-2">{test.mode === "words" ? test.wordCount : test.time}</td>
            <td className="p-2 capitalize">{test.mode}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
});

export default TestHistoryTable;
