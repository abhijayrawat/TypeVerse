import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export default function Dashboard() {
  const { token } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ bestWpm: 0, bestAccuracy: 0, tests: 0 });

  useEffect(() => {
    if (!token) return;
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/tests`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setHistory(res.data);
        setStats({
          bestWpm: Math.max(...res.data.map((t) => t.wpm), 0),
          bestAccuracy: Math.max(...res.data.map((t) => t.accuracy), 0),
          tests: res.data.length,
        });
      })
      .catch((err) => console.error("Failed to fetch test history", err));
  }, [token]);

  return (
    <div className="py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="flex gap-6 mb-8">
        <StatsCard label="Best WPM" value={stats.bestWpm} />
        <StatsCard label="Best Accuracy" value={stats.bestAccuracy + "%"} />
        <StatsCard label="Tests Taken" value={stats.tests} />
      </div>
      <h2 className="text-xl font-bold mb-3">Test History</h2>
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
          {history.map((test) => (
            <tr key={test._id} className="hover:bg-zinc-700">
              <td className="p-2">{new Date(test.date).toLocaleString()}</td>
              <td className="p-2">{test.wpm}</td>
              <td className="p-2">{test.accuracy}%</td>
              <td className="p-2">{test.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
