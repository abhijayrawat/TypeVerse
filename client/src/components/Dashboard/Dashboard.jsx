import { useContext, useEffect, useState, useMemo } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import StatsSummary from "./StatsSummary";
import FilterControls from "./FilterControls";
import TestHistoryTable from "./TestHistoryTable";

const TIMEFRAMES = [
  { label: "All Time", value: "all" },
  { label: "Today", value: "day" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
];

const MODES = [
  { label: "Timed Mode", value: "time" },
  { label: "Word Count Mode", value: "words" },
];

export default function Dashboard() {
  const { user, token } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clearLoading, setClearLoading] = useState(false);

  const [timeFilter, setTimeFilter] = useState("all");
  const [modeFilter, setModeFilter] = useState("time");

  const fetchHistory = () => {
    if (!user || !token) {
      setLoading(false);
      setHistory([]);
      return;
    }
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/tests`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { timeFrame: timeFilter, mode: modeFilter },
      })
      .then((res) => {
        setHistory(res.data);
        setError(null);
      })
      .catch(() => setError("Failed to fetch test history"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHistory();
  }, [user, token, timeFilter, modeFilter]);

  const bestWpm = useMemo(() => {
    return history.length ? Math.max(...history.map((t) => t.wpm)) : 0;
  }, [history]);

  const bestAccuracy = useMemo(() => {
    return history.length ? Math.max(...history.map((t) => t.accuracy)) : 0;
  }, [history]);

  const clearTests = async ({ timeFrame = timeFilter, mode = modeFilter, limit } = {}) => {
    if (!token) {
      alert("Login required to clear saved tests!");
      return;
    }

    if (!window.confirm("Are you sure you want to clear these tests?")) return;

    setClearLoading(true);
    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/tests/clear`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { timeFrame, mode, limit },
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

      <StatsSummary bestWpm={bestWpm} bestAccuracy={bestAccuracy} testsCount={history.length} />

      <FilterControls
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
        modeFilter={modeFilter}
        setModeFilter={setModeFilter}
        clearTests={clearTests}
        clearLoading={clearLoading}
        TIMEFRAMES={TIMEFRAMES}
        MODES={MODES}
      />

      <TestHistoryTable history={history} />
    </div>
  );
}
