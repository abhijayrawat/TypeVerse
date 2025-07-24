// src/components/TypingTest.jsx
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
 import axios from "axios";
import TypingDisplay from "./TypingDisplay";
import StatsPanel from "./StatsPanel";
import words from "../words";

function pickWords(n = 25) {
  return Array.from({ length: n }, () => words[Math.floor(Math.random() * words.length)]);
}

export default function TypingTest() {
  /* ────────────────────────────────  STATE  ──────────────────────────────── */
  const { token } = useContext(AuthContext);

  const DURATIONS = [15, 30, 60];

  const [wordList, setWordList] = useState(pickWords());
  const [testDuration, setTestDuration] = useState(15);
  const [timeLeft, setTimeLeft] = useState(15);

  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  const [correctChars, setCorrectChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);

  const [skipSpaces, setSkipSpaces] = useState(false);

  const timerRef = useRef(null);

  /* ──────────────────────────  WORD-BOUNDARY CACHE  ───────────────────────── */
  // indices (1-based) where a space should appear in skip-spaces mode
  const wordBoundaries = useRef([]);
  useEffect(() => {
    let cum = 0;
    const boundaryArr = [];
    for (const w of wordList) {
      cum += w.length;
      boundaryArr.push(cum);
    }
    wordBoundaries.current = boundaryArr; // e.g. [5, 11, 17, …]
  }, [wordList]);

  /* ──────────────────────────────  TIMERS  ──────────────────────────────── */
  useEffect(() => {
    if (started && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1_000);
    } else if (started && timeLeft === 0) {
      setFinished(true);
    }
    return () => clearTimeout(timerRef.current);
  }, [started, timeLeft]);

  /* ───────────────────────────────  HELPERS  ─────────────────────────────── */
  const targetText = wordList.join(" ");

  const buildDisplay = (typedNoSpaces) => {
    let out = "";
    for (let i = 0; i < typedNoSpaces.length; i++) {
      out += typedNoSpaces[i];
      if (wordBoundaries.current.includes(i + 1)) out += " ";
    }
    return out;
  };

  const calcStats = () => {
    const elapsed = testDuration - timeLeft || 1; // prevent ÷0
    const wpm = Math.round((correctChars / 5 / elapsed) * 60);
    const accuracy =
      totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : started ? 0 : 100;
    return { wpm, accuracy };
  };

  const restart = (duration = testDuration) => {
    setWordList(pickWords());
    setTestDuration(duration);
    setTimeLeft(duration);
    setInput("");
    setStarted(false);
    setFinished(false);
    setCorrectChars(0);
    setTotalChars(0);
  };

  /* ───────────────────────────── INPUT HANDLER ───────────────────────────── */
  const handleChange = (e) => {
    if (finished) return;
    if (!started) setStarted(true);

    const raw = e.target.value;

    if (skipSpaces) {
      const typed = raw.replace(/\s/g, ""); // remove user-typed spaces
      const displayStr = buildDisplay(typed);
      setInput(displayStr);
      setTotalChars(typed.length);

      const targetNoSpaces = targetText.replace(/\s/g, "");
      let correct = 0;
      for (let i = 0; i < typed.length; i++) {
        if (typed[i] === targetNoSpaces[i]) correct++;
      }
      setCorrectChars(correct);
    } else {
      setInput(raw);
      setTotalChars(raw.length);

      let correct = 0;
      for (let i = 0; i < raw.length; i++) {
        if (raw[i] === targetText[i]) correct++;
      }
      setCorrectChars(correct);
    }
  };

  /* ────────────────────────────  SAVE ON FINISH  ─────────────────────────── */
  useEffect(() => {
    if (!finished) return;
    const { wpm, accuracy } = calcStats();

    const save = async () => {
      try {
        if (token) {
          await axios.post(
            `${import.meta.env.VITE_API_URL}/api/tests`,
            { wpm, accuracy, time: testDuration },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } else {
          const store = JSON.parse(localStorage.getItem("typeverse-guest-tests") || "[]");
          store.unshift({
            wpm,
            accuracy,
            time: testDuration,
            date: new Date().toISOString(),
          });
          if (store.length > 50) store.pop();
          localStorage.setItem("typeverse-guest-tests", JSON.stringify(store));
        }
      } catch (err) {
        console.error("Saving result failed:", err);
      }
    };
    save();
  }, [finished]);

  const stats = calcStats();

  /* ─────────────────────────────  RENDER  ──────────────────────────────── */
  return (
    <div className="flex flex-col items-center min-h-screen bg-zinc-900 text-white pt-20 p-6">
      <h1 className="text-4xl font-mono font-bold mb-8">TypeVerse</h1>

      {/* Time buttons + skip toggle */}
      <div className="flex items-center gap-4 mb-6">
        {DURATIONS.map((d) => (
          <button
            key={d}
            disabled={started}
            onClick={() => restart(d)}
            className={`px-4 py-2 rounded-full font-semibold transition focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ${
              testDuration === d
                ? "bg-yellow-500 text-black shadow-lg scale-110"
                : "bg-zinc-800 hover:bg-zinc-700"
            }`}
          >
            {d}s
          </button>
        ))}

        <button
          disabled={started}
          onClick={() => {
            setSkipSpaces((s) => !s);
            restart(testDuration);
          }}
          className={`px-3 py-1 rounded-full font-semibold transition focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ${
            skipSpaces
              ? "bg-yellow-400 text-black"
              : "bg-zinc-700 text-zinc-300 hover:bg-yellow-500 hover:text-black"
          }`}
          title={skipSpaces ? "Auto-skip spaces ON" : "Auto-skip spaces OFF"}
        >
          {skipSpaces ? "Skip Spaces ✓" : "Type Spaces"}
        </button>
      </div>

      <StatsPanel wpm={stats.wpm} accuracy={stats.accuracy} timeLeft={timeLeft} />

      <TypingDisplay wordList={wordList} input={input} />

      <textarea
        className="mt-8 w-full max-w-4xl h-28 bg-zinc-800 p-4 rounded font-mono text-lg outline-none resize-none"
        value={input}
        onChange={handleChange}
        disabled={finished}
        placeholder="Start typing…"
        autoFocus
      />

      <button
        onClick={() => restart(testDuration)}
        className="mt-6 px-8 py-3 rounded bg-yellow-500 hover:bg-yellow-400 text-black font-bold transition"
      >
        Restart
      </button>

      {finished && (
        <div className="mt-6 border border-yellow-500 p-4 rounded text-center font-mono">
          <p>
            WPM: <strong>{stats.wpm}</strong> | Accuracy: <strong>{stats.accuracy}%</strong>
          </p>
        </div>
      )}
    </div>
  );
}
