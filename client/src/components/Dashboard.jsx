import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export default function Dashboard() {
  const { user, token } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && token) {
      // Fetch user's history from backend
      setLoading(true);
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/tests`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => setHistory(res.data))
        .catch(() => setError("Failed to fetch test history"))
        .finally(() => setLoading(false));
    } else {
      // Load guest (local) history
      setHistory(JSON.parse(localStorage.getItem("typeverse-guest-tests") || "[]"));
      setLoading(false);
    }
  }, [user, token]);

  // Compute stats
  const bestWpm = history.length ? Math.max(...history.map(t => t.wpm)) : 0;
  const bestAccuracy = history.length ? Math.max(...history.map(t => t.accuracy)) : 0;

  if (loading) return <div className="p-4">Loading dashboard...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="flex gap-6 mb-8">
        <StatsCard label="Best WPM" value={bestWpm} />
        <StatsCard label="Best Accuracy" value={bestAccuracy + "%"} />
        <StatsCard label="Tests Taken" value={history.length} />
      </div>
      <h2 className="text-xl font-bold mb-3">Test History</h2>
      {history.length === 0 ? (
        <div className="text-zinc-400">No tests taken yet.</div>
      ) : (
        <table className="w-full bg-zinc-800 rounded shadow">
          <thead>
            <tr>
              <th className="text-left p-2">Date</th>
              <th className="text-left p-2">WPM</th>
              <th className="text-left p-2">Accuracy</th>
              <th className="text-left p-2">Time (s)</th>
            </tr>
          </thead>
          <tbody>
            {history.map(test => (
              <tr key={test._id || test.date} className="hover:bg-zinc-700">
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

function StatsCard({ label, value }) {
  return (
    <div className="flex flex-col items-center bg-zinc-800 py-4 px-6 rounded-lg shadow">
      <div className="text-xs text-zinc-400 uppercase">{label}</div>
      <div className="text-2xl font-bold text-yellow-400">{value}</div>
    </div>
  );
}
