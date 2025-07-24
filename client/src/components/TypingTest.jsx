import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import TypingDisplay from "./TypingDisplay";
import StatsPanel from "./StatsPanel";
import words from "../words";

function getWords(n = 25) {
  return Array.from({ length: n }, () => words[Math.floor(Math.random() * words.length)]);
}

export default function TypingTest() {
  const { token } = useContext(AuthContext);

  const [wordList, setWordList] = useState(getWords());
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [finished, setFinished] = useState(false);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const timerRef = useRef(null);

  // Timer logic
  useEffect(() => {
    if (started && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setFinished(true);
      clearTimeout(timerRef.current);
    }
    return () => clearTimeout(timerRef.current);
  }, [started, timeLeft]);

  // Calculate stats
  const calculateStats = () => {
    const elapsedTime = 15 - timeLeft;
    const wpm = elapsedTime > 0 ? Math.round((correctChars / 5 / elapsedTime) * 60) : 0;
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
    return { wpm, accuracy };
  };

  // Save to backend when test finishes
  useEffect(() => {
    if (finished && token) {
      const { wpm, accuracy } = calculateStats();
      const testTime = 15;

      axios
        .post(
          `${import.meta.env.VITE_API_URL}/api/tests`,
          { wpm, accuracy, time: testTime },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .catch((err) => console.error("Failed to save test result", err));
    }
  }, [finished]);

  const handleChange = (e) => {
    if (!started) setStarted(true);
    if (finished) return;

    const val = e.target.value;
    setInput(val);

    const targetText = wordList.join(" ");
    let correct = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === targetText[i]) {
        correct++;
      }
    }
    setCorrectChars(correct);
    setTotalChars(val.length);
  };

  const restartTest = () => {
    setWordList(getWords());
    setInput("");
    setStarted(false);
    setTimeLeft(15);
    setFinished(false);
    setCorrectChars(0);
    setTotalChars(0);
  };

  const stats = calculateStats();

  return (
    <div className="flex flex-col items-center min-h-screen bg-zinc-900 text-white p-8 pt-20">
      <h1 className="text-4xl mb-8 font-mono font-bold">TypeVerse</h1>

      <StatsPanel wpm={stats.wpm} accuracy={stats.accuracy} timeLeft={timeLeft} />

      <TypingDisplay wordList={wordList} input={input} finished={finished} />

      <textarea
        className="mt-8 w-full max-w-4xl h-28 p-4 bg-zinc-800 rounded resize-none outline-none font-mono text-lg"
        onChange={handleChange}
        value={input}
        placeholder="Start typing here..."
        disabled={finished}
        autoFocus
      />

      <button
        onClick={restartTest}
        className="mt-6 px-8 py-3 rounded bg-yellow-500 hover:bg-yellow-400 text-black font-bold transition"
      >
        Restart
      </button>

      {finished && (
        <div className="mt-6 p-4 border border-yellow-500 rounded max-w-4xl text-center font-mono">
          <h2 className="text-yellow-400 text-2xl font-bold mb-2">Test finished!</h2>
          <p>Your final WPM is <strong>{stats.wpm}</strong> and accuracy is <strong>{stats.accuracy}%</strong>.</p>
        </div>
      )}
    </div>
  );
}
