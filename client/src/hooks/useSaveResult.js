// useSaveResult.js
import { useEffect, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function useSaveResult(finished, { mode, testDuration, wordList, stats, token }) {
  const hasSavedRef = useRef(false);

  useEffect(() => {
    if (!finished) {
      hasSavedRef.current = false;
      return;
    }
    if (hasSavedRef.current) return;

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
              mode,  // <--- Pass mode here
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
            mode, // <--- Save mode here for guest
            date: new Date().toISOString(),
          });
          if (guestTests.length > 50) guestTests.pop();
          localStorage.setItem("typeverse-guest-tests", JSON.stringify(guestTests));
        }
        hasSavedRef.current = true;
      } catch (e) {
        console.error("Failed to save test result", e);
      }
    };

    saveResult();
  }, [finished, token, mode, testDuration, wordList.length, stats]);
}
