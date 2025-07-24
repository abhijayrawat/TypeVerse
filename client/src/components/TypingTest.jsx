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

  const [testDuration, setTestDuration] = useState(15); // for UI & stats
  const [timeLeft, setTimeLeft] = useState(15);          // for countdown
  const [wordList, setWordList] = useState(getWords());
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const timerRef = useRef(null);
  const [skipSpaces, setSkipSpaces] = useState(false);


  // Reset test
  const restartTest = (time) => {
    setWordList(getWords());
    setInput("");
    setStarted(false);
    setTimeLeft(time);
    setFinished(false);
    setCorrectChars(0);
    setTotalChars(0);
  };

  // Timer effect
  useEffect(() => {
    if (started && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      setFinished(true);
      clearTimeout(timerRef.current);
    }
    return () => clearTimeout(timerRef.current);
  }, [started, timeLeft]);

  // Stats
  const calculateStats = () => {
    const elapsedTime = testDuration - timeLeft;
    const wpm = elapsedTime > 0 ? Math.round((correctChars / 5 / elapsedTime) * 60) : 0;
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
    return { wpm, accuracy };
  };

  // Save results
  useEffect(() => {
    if (!finished) return;
    const { wpm, accuracy } = calculateStats();

    if (token) {
      axios
        .post(
          `${import.meta.env.VITE_API_URL}/api/tests`,
          { wpm, accuracy, time: testDuration },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .catch((err) =>
          console.error("Failed to save test result", err.response?.data || err.message)
        );
    } else {
      try {
        const guestTests = JSON.parse(localStorage.getItem("typeverse-guest-tests") || "[]");
        guestTests.unshift({
          wpm,
          accuracy,
          time: testDuration,
          date: new Date().toISOString(),
        });
        if (guestTests.length > 50) guestTests.pop();
        localStorage.setItem("typeverse-guest-tests", JSON.stringify(guestTests));
      } catch (e) {
        console.error("Failed to save guest test result", e);
      }
    }
  }, [finished]);

  const handleChange = (e) => {
  if (!started) setStarted(true);
  if (finished) return;

  const val = e.target.value;
  const target = wordList.join(" ");

  let correct = 0;
  const minLen = Math.min(val.length, target.length);

  for (let i = 0; i < minLen; i++) {
    if (val[i] === target[i]) correct++;
  }

  setInput(val);
  setCorrectChars(correct);
  setTotalChars(val.length);
};


  return (
    <div className="flex flex-col items-center min-h-screen bg-zinc-900 text-white p-8 pt-20">
      <h1 className="text-4xl mb-8 font-mono font-bold">TypeVerse</h1>

      {/* Time Selector Buttons */}
      <div className="mb-6 flex flex-row gap-4">
        {[15, 30, 60].map((time) => (
          <button
            key={time}
            onClick={() => {
              setTestDuration(time); // UI highlight & saving
              restartTest(time);     // immediate logic
            }}
            disabled={started}
            className={`px-4 py-2 rounded-full font-semibold transition focus:outline-none
              ${testDuration === time
                ? "bg-yellow-500 text-black shadow-lg scale-110"
                : "bg-zinc-800 hover:bg-zinc-700 text-white"}`}
            style={{ minWidth: "64px" }}
          >
            {time} sec
          </button>
        ))}
      </div>
      

      <StatsPanel wpm={calculateStats().wpm} accuracy={calculateStats().accuracy} timeLeft={timeLeft} />
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
        onClick={() => restartTest(testDuration)}
        className="mt-6 px-8 py-3 rounded bg-yellow-500 hover:bg-yellow-400 text-black font-bold transition"
      >
        Restart
      </button>
      {finished && (
        <div className="mt-6 p-4 border border-yellow-500 rounded max-w-4xl text-center font-mono">
          <h2 className="text-yellow-400 text-2xl font-bold mb-2">Test finished!</h2>
          <p>
            Your final WPM is <strong>{calculateStats().wpm}</strong> and accuracy is <strong>{calculateStats().accuracy}%</strong>.
          </p>
        </div>
      )}
    </div>
  );
}
