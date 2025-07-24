import { useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function useSaveResult(finished, { mode, testDuration, wordList, stats }) {
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (!finished) return;

    const saveResult = async () => {
      try {
        if (token) {
          await axios.post(
            `${import.meta.env.VITE_API_URL}/api/tests`,
            {
              wpm: stats.wpm,
              accuracy: stats.accuracy,
              time: mode === "time" ? testDuration : 0,
              wordCount: wordList.length,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } else {
          const guestTests = JSON.parse(localStorage.getItem("typeverse-guest-tests") || "[]");
          guestTests.unshift({
            wpm: stats.wpm,
            accuracy: stats.accuracy,
            time: mode === "time" ? testDuration : 0,
            wordCount: wordList.length,
            date: new Date().toISOString(),
          });
          if (guestTests.length > 50) guestTests.pop();
          localStorage.setItem("typeverse-guest-tests", JSON.stringify(guestTests));
        }
      } catch (e) {
        console.error("Failed to save test result", e);
      }
    };

    saveResult();
  }, [finished, token, mode, testDuration, wordList.length, stats]);
}
