import { useEffect, useState } from "react";
import axios from "axios";

const MODES = [
  { label: "Timed Mode", value: "time" },
  { label: "Word Count Mode", value: "words" },
];

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modeFilter, setModeFilter] = useState("time");

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/leaderboard`, {
        params: { mode: modeFilter },
      })
      .then((res) => {
        setLeaders(res.data);
        setError(null);
      })
      .catch(() => setError("Failed to load leaderboard"))
      .finally(() => setLoading(false));
  }, [modeFilter]);

  if (loading) return <div className="p-4">Loading leaderboard...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl p-8 mx-auto bg-zinc-800 rounded text-white shadow">
      <h1 className="text-3xl font-bold mb-6">Global Leaderboard</h1>

      {/* Mode Filter Dropdown */}
      <div className="mb-4">
        <select
          aria-label="Filter leaderboard by mode"
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
      </div>

      <table className="w-full table-auto border-collapse border border-zinc-600">
        <thead>
          <tr className="bg-zinc-700">
            <th className="p-3 border border-zinc-600 text-left">Rank</th>
            <th className="p-3 border border-zinc-600 text-left">Username</th>
            <th className="p-3 border border-zinc-600 text-left">WPM</th>
            <th className="p-3 border border-zinc-600 text-left">Accuracy</th>
            <th className="p-3 border border-zinc-600 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {leaders.map((user, idx) => (
            <tr
              key={user._id}
              className={idx % 2 === 0 ? "bg-zinc-700" : "bg-zinc-800"}
            >
              <td className="p-3 border border-zinc-600">{idx + 1}</td>
              <td className="p-3 border border-zinc-600">{user.username}</td>
              <td className="p-3 border border-zinc-600">{user.wpm}</td>
              <td className="p-3 border border-zinc-600">{user.accuracy}%</td>
              <td className="p-3 border border-zinc-600">
                {new Date(user.date).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
