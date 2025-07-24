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

  const [testDuration, setTestDuration] = useState(15); // default 15 seconds
  const [wordList, setWordList] = useState(getWords());
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(testDuration);
  const [finished, setFinished] = useState(false);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const timerRef = useRef(null);

  // Reset test
  const restartTest = () => {
    setWordList(getWords());
    setInput("");
    setStarted(false);
    setTimeLeft(testDuration);
    setFinished(false);
    setCorrectChars(0);
    setTotalChars(0);
  };

  // Timer effect
  useEffect(() => {
    if (started && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
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

  // Handle input with soft auto-space
  const handleChange = (e) => {
    if (!started) setStarted(true);
    if (finished) return;
    let val = e.target.value;

    const targetText = wordList.join(" ");
    // Remove all spaces typed by the user
    let cleanedVal = "";
    for (let i = 0; i < val.length; i++) {
      if (val[i] !== " ") cleanedVal += val[i];
    }
    // Place spaces where words would occur
    let rebuiltInput = "";
    let typedIdx = 0;
    for (let w of wordList) {
      const len = w.length;
      if (typedIdx + len <= cleanedVal.length) {
        rebuiltInput += w + " ";
        typedIdx += len;
      } else {
        rebuiltInput += cleanedVal.slice(typedIdx);
        break;
      }
    }
    if (rebuiltInput.length > targetText.length) {
      rebuiltInput = rebuiltInput.slice(0, targetText.length);
    }

    setInput(rebuiltInput);

    let correct = 0;
    for (let i = 0; i < rebuiltInput.length; i++) {
      if (rebuiltInput[i] === targetText[i]) correct++;
    }
    setCorrectChars(correct);
    setTotalChars(rebuiltInput.length);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-zinc-900 text-white p-8 pt-20">
      <h1 className="text-4xl mb-8 font-mono font-bold">TypeVerse</h1>

      {/* Horizontal button group for test time selection */}
      <div className="mb-6 flex flex-row gap-4">
        {[5, 15, 30, 60].map((time) => (
          <button
            key={time}
            onClick={() => {
              setTestDuration(time);
              restartTest();
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
        onClick={restartTest}
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
