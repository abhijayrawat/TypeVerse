import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

function StatsCard({ label, value }) {
  return (
    <div className="flex flex-col items-center bg-zinc-800 py-4 px-6 rounded-lg shadow">
      <div className="text-xs text-zinc-400 uppercase">{label}</div>
      <div className="text-2xl font-bold text-yellow-400">{value}</div>
    </div>
  );
}

const TIMEFRAMES = [
  { label: "All Time", value: "all" },
  { label: "Today", value: "day" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
];

export default function Dashboard() {
  const { user, token } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clearLoading, setClearLoading] = useState(false);

  // New state for filtering test history and clearing scope
  const [timeFilter, setTimeFilter] = useState("all");

  // Fetch test history
  const fetchHistory = () => {
    if (user && token) {
      setLoading(true);
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/tests?timeFrame=${timeFilter}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setHistory(res.data);
          setError(null);
        })
        .catch(() => setError("Failed to fetch test history"))
        .finally(() => setLoading(false));
    } else {
      try {
        const guestTests = JSON.parse(localStorage.getItem("typeverse-guest-tests") || "[]");
        setHistory(guestTests);
        setError(null);
      } catch {
        setHistory([]);
        setError("Failed to load local test history");
      }
      setLoading(false);
    }
  };

  // Fetch history on mount and when user/token/timeFilter changes
  useEffect(() => {
    fetchHistory();
  }, [user, token, timeFilter]);

  // Calculate stats
  const bestWpm = history.length > 0 ? Math.max(...history.map((t) => t.wpm)) : 0;
  const bestAccuracy = history.length > 0 ? Math.max(...history.map((t) => t.accuracy)) : 0;

  // Handler to clear tests (deletes all matching the current timeFilter)
  const clearTests = async ({ timeFrame = timeFilter, limit } = {}) => {
    if (!token) {
      alert("Login required to clear saved tests!");
      return;
    }

    if (!window.confirm("Are you sure you want to clear these tests?")) return;

    setClearLoading(true);

    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/tests/clear`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { timeFrame, limit },
      });

      if (res.status === 200) {
        alert("Tests cleared successfully");
        fetchHistory();
      } else {
        alert("Failed to clear tests");
      }
    } catch (e) {
      alert("Error clearing tests");
      console.error(e);
    } finally {
      setClearLoading(false);
    }
  };

  if (loading) return <div className="p-4">Loading dashboard...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="flex gap-6 mb-8">
        <StatsCard label="Best WPM" value={bestWpm} />
        <StatsCard label="Best Accuracy" value={`${bestAccuracy}%`} />
        <StatsCard label="Tests Taken" value={history.length} />
      </div>

      {/* Test History header with inline filter and clear buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-4">
        <h2 className="text-xl font-bold">Test History</h2>

        <div className="flex flex-wrap items-center gap-3">
          {/* Timeframe filter dropdown */}
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

          {/* Clear buttons */}
          <button
            disabled={clearLoading}
            onClick={() => clearTests({ timeFrame: timeFilter, limit: 5 })}
            className="px-4 py-1 font-semibold rounded bg-red-600 hover:bg-red-700 disabled:opacity-50 transition focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Clear Last 5
          </button>
          <button
            disabled={clearLoading}
            onClick={() => clearTests({ timeFrame: timeFilter })}
            className="px-4 py-1 font-semibold rounded bg-red-600 hover:bg-red-700 disabled:opacity-50 transition focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Clear All
          </button>
        </div>
      </div>

      {history.length === 0 ? (
        <p className="text-zinc-400">No tests taken yet.</p>
      ) : (
        <table className="w-full bg-zinc-800 rounded shadow mb-8">
          <thead>
            <tr>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">WPM</th>
              <th className="p-2 text-left">Accuracy</th>
              <th className="p-2 text-left">Time (s)</th>
            </tr>
          </thead>
          <tbody>
            {history.map((test, idx) => (
              <tr key={test._id || idx} className="hover:bg-zinc-700">
                <td className="p-2">{new Date(test.date).toLocaleString()}</td>
                <td className="p-2">{test.wpm}</td>
                <td className="p-2">{test.accuracy}%</td>
                <td className="p-2">{test.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
