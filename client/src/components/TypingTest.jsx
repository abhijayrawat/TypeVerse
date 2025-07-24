import { useState, useEffect, useRef } from "react";
import TypingDisplay from "./TypingDisplay";
import StatsPanel from "./StatsPanel";
import words from "../words";

function getWords(n = 25) {
  return Array.from({ length: n }, () => words[Math.floor(Math.random() * words.length)]);
}

export default function TypingTest() {
  const [wordList, setWordList] = useState(getWords());
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15); // seconds
  const [finished, setFinished] = useState(false);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const timerRef = useRef(null);

  // Start timer on first key stroke
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
    const wpm = Math.round((correctChars / 5 / (15 - timeLeft)) * 60) || 0;
    const accuracy = totalChars === 0 ? 100 : Math.round((correctChars / totalChars) * 100);
    return { wpm, accuracy };
  };

  // Handle input change
  const handleChange = (e) => {
    if (!started) setStarted(true);
    if (finished) return;
    const val = e.target.value;
    setInput(val);

    const targetText = wordList.join(" ");
    let correct = 0;
    // Count correct chars
    for (let i = 0; i < val.length; i++) {
      if (val[i] === targetText[i]) {
        correct++;
      }
    }
    setCorrectChars(correct);
    setTotalChars(val.length);
  };

  // Restart Test
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
    <div className="flex flex-col items-center min-h-screen bg-zinc-900 text-white p-8">
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
