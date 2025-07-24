// src/components/TypingTest.jsx
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import TypingDisplay from "./TypingDisplay";
import StatsPanel from "./StatsPanel";
import words from "../words";

function pickWords(n) {
  return Array.from({ length: n }, () => words[Math.floor(Math.random() * words.length)]);
}

export default function TypingTest() {
  const { token } = useContext(AuthContext);

  // Modes: "time" for timed test, "words" for fixed-word count test
  const [mode, setMode] = useState("time"); // default to timed
  const [wordTarget, setWordTarget] = useState(25); // number of words for fixed-word mode

  const DURATIONS = [15, 30, 60]; // Timed options

  // State variables
  const [wordList, setWordList] = useState(pickWords(25));
  const [testDuration, setTestDuration] = useState(15);
  const [timeLeft, setTimeLeft] = useState(15);

  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  const [correctChars, setCorrectChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);

  const [skipSpaces, setSkipSpaces] = useState(false);

  const timerRef = useRef(null);

  // Word boundaries for skip-spaces mode
  const wordBoundaries = useRef([]);
  useEffect(() => {
    let cum = 0;
    const boundaryArr = [];
    for (const w of wordList) {
      cum += w.length;
      boundaryArr.push(cum);
    }
    wordBoundaries.current = boundaryArr;
  }, [wordList]);

  // Reset & restart test: pick words/count/duration depending on mode
  const restart = (duration = testDuration, wordCount = wordTarget) => {
    const nWords = mode === "words" ? wordCount : 25;
    setWordList(pickWords(nWords));
    if (mode === "time") {
      setTestDuration(duration);
      setTimeLeft(duration);
    } else {
      setTestDuration(0); // no timer in fixed-word mode
      setTimeLeft(0);
    }
    setInput("");
    setStarted(false);
    setFinished(false);
    setCorrectChars(0);
    setTotalChars(0);
  };

  // Timer countdown for timed mode
  useEffect(() => {
    if (mode === "time" && started && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    } else if (mode === "time" && started && timeLeft === 0) {
      setFinished(true);
    }
    return () => clearTimeout(timerRef.current);
  }, [mode, started, timeLeft]);

  // Calculate stats based on mode
  const calcStats = () => {
    const elapsed = mode === "time" ? (testDuration - timeLeft || 1) : (started ? performance.now() : 1);
    // For Fixed-Word mode, elapsed is real time since start, in seconds
    const elapsedSeconds = mode === "time" ? elapsed : (elapsed / 1000);

    const wpm = elapsedSeconds > 0 ? Math.round((correctChars / 5 / elapsedSeconds) * 60) : 0;
    const accuracy =
      totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : started ? 0 : 100;
    return { wpm, accuracy };
  };

  // Save results on finish
  useEffect(() => {
    if (!finished) return;
    const { wpm, accuracy } = calcStats();

    const saveResult = async () => {
      try {
        if (token) {
          await axios.post(
            `${import.meta.env.VITE_API_URL}/api/tests`,
            { wpm, accuracy, time: mode === "time" ? testDuration : 0, wordCount: wordList.length },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } else {
          const storedTests = JSON.parse(localStorage.getItem("typeverse-guest-tests") || "[]");
          storedTests.unshift({
            wpm,
            accuracy,
            time: mode === "time" ? testDuration : 0,
            wordCount: wordList.length,
            date: new Date().toISOString(),
          });
          if (storedTests.length > 50) storedTests.pop();
          localStorage.setItem("typeverse-guest-tests", JSON.stringify(storedTests));
        }
      } catch (err) {
        console.error("Failed to save test result", err);
      }
    };

    saveResult();
  }, [finished]);

  // Build display string for skip-spaces mode, inserting spaces only at boundaries (do not overwrite letters)
  const buildDisplay = (typedNoSpaces) => {
    let out = "";
    for (let i = 0; i < typedNoSpaces.length; i++) {
      out += typedNoSpaces[i];
      if (wordBoundaries.current.includes(i + 1)) out += " ";
    }
    return out;
  };

  // Input event handler
  const handleChange = (e) => {
    if (finished) return;
    if (!started) setStarted(true);

    const raw = e.target.value;
    const targetText = wordList.join(" ");

    if (skipSpaces) {
      // Filter out spaces typed by user for skip-spaces mode
      const typed = raw.replace(/\s/g, "");
      const displayStr = buildDisplay(typed);
      setInput(displayStr);
      setTotalChars(typed.length);

      const targetNoSpaces = targetText.replace(/\s/g, "");
      let correct = 0;
      for (let i = 0; i < typed.length; i++) {
        if (typed[i] === targetNoSpaces[i]) correct++;
      }
      setCorrectChars(correct);

      // For fixed-word mode, finish test automatically when all words typed
      if (mode === "words" && typed.length >= targetNoSpaces.length) {
        setFinished(true);
      }

    } else {
      // Normal mode requires user to enter spaces exactly
      setInput(raw);
      setTotalChars(raw.length);

      let correct = 0;
      for (let i = 0; i < raw.length; i++) {
        if (raw[i] === targetText[i]) correct++;
      }
      setCorrectChars(correct);

      if (mode === "words" && raw.length >= targetText.length) {
        setFinished(true);
      }
    }
  };

  const stats = calcStats();

  return (
    <div className="flex flex-col items-center min-h-screen bg-zinc-900 text-white pt-20 p-6">
      <h1 className="text-4xl font-mono font-bold mb-8">TypeVerse</h1>

      {/* Mode selector */}
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 font-semibold rounded-full transition ${
            mode === "time" ? "bg-yellow-500 text-black" : "bg-zinc-800 hover:bg-zinc-700"
          }`}
          onClick={() => {
            if (!started) {
              setMode("time");
              restart(15);
            }
          }}
          disabled={started}
        >
          Timed Mode
        </button>
        <button
          className={`px-4 py-2 font-semibold rounded-full transition ${
            mode === "words" ? "bg-yellow-500 text-black" : "bg-zinc-800 hover:bg-zinc-700"
          }`}
          onClick={() => {
            if (!started) {
              setMode("words");
              restart(undefined, 25);
            }
          }}
          disabled={started}
        >
          Fixed-Word Mode
        </button>
      </div>

      {/* Duration or word count selector depending on mode */}
      {mode === "time" ? (
        <div className="flex gap-4 mb-6 items-center">
          {DURATIONS.map((d) => (
            <button
              key={d}
              disabled={started}
              onClick={() => restart(d)}
              className={`px-4 py-2 font-semibold rounded-full transition focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ${
                testDuration === d ? "bg-yellow-500 text-black shadow-lg scale-110" : "bg-zinc-800 hover:bg-zinc-700"
              }`}
            >
              {d}s
            </button>
          ))}

          {/* Skip Spaces Toggle */}
          <button
            disabled={started}
            onClick={() => {
              setSkipSpaces((s) => !s);
              restart(testDuration);
            }}
            className={`px-3 py-1 ml-4 font-semibold rounded-full transition focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ${
              skipSpaces ? "bg-yellow-400 text-black" : "bg-zinc-700 text-zinc-300 hover:bg-yellow-500 hover:text-black"
            }`}
            title={skipSpaces ? "Auto-skip spaces ON" : "Auto-skip spaces OFF"}
          >
            {skipSpaces ? "Skip Spaces ✓" : "Type Spaces"}
          </button>
        </div>
      ) : (
        <div className="flex gap-4 mb-6 items-center">
          {[10, 25, 50, 100].map((count) => (
            <button
              key={count}
              disabled={started}
              onClick={() => restart(undefined, count)}
              className={`px-4 py-2 font-semibold rounded-full transition focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ${
                wordTarget === count ? "bg-yellow-500 text-black shadow-lg scale-110" : "bg-zinc-800 hover:bg-zinc-700"
              }`}
            >
              {count} Words
            </button>
          ))}

          {/* Skip Spaces Toggle */}
          <button
            disabled={started}
            onClick={() => {
              setSkipSpaces((s) => !s);
              restart(undefined, wordTarget);
            }}
            className={`px-3 py-1 ml-4 font-semibold rounded-full transition focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ${
              skipSpaces ? "bg-yellow-400 text-black" : "bg-zinc-700 text-zinc-300 hover:bg-yellow-500 hover:text-black"
            }`}
            title={skipSpaces ? "Auto-skip spaces ON" : "Auto-skip spaces OFF"}
          >
            {skipSpaces ? "Skip Spaces ✓" : "Type Spaces"}
          </button>
        </div>
      )}

      <StatsPanel wpm={stats.wpm} accuracy={stats.accuracy} timeLeft={mode === "time" ? timeLeft : null} />

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
        onClick={() => restart(mode === "time" ? testDuration : wordTarget)}
        className="mt-6 px-8 py-3 rounded bg-yellow-500 hover:bg-yellow-400 text-black font-bold transition"
      >
        Restart
      </button>

      {finished && (
        <div className="mt-6 border border-yellow-500 p-4 rounded text-center font-mono">
          <p>
            WPM: <strong>{stats.wpm}</strong> | Accuracy: <strong>{stats.accuracy}%</strong>{" "}
            {mode === "words" && `| Words: ${wordList.length}`}
          </p>
          <p className="italic text-sm mt-1">
            Test completed in{" "}
            {mode === "time"
              ? `${testDuration - timeLeft} seconds`
              : "all words typed"}
            .
          </p>
        </div>
      )}
    </div>
  );
}
