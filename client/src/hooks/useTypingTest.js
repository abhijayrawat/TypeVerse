import { useState, useEffect, useRef, useCallback } from "react";
import pickWords from "../utils/pickWords";
import useWordBoundaries from "../hooks/useWordBoundaries";
import useBuildDisplay from "../hooks/useBuildDisplay";

export default function useTypingTest(initialMode = "time", initialDuration = 15, initialWordCount = 25) {
  const [mode, setMode] = useState(initialMode);
  const [wordTarget, setWordTarget] = useState(initialWordCount);
  const [wordList, setWordList] = useState(pickWords(initialWordCount));
  const [testDuration, setTestDuration] = useState(initialDuration);
  const [timeLeft, setTimeLeft] = useState(initialDuration);
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [skipSpaces, setSkipSpaces] = useState(false);

  const timerRef = useRef(null);

  const wordBoundaries = useWordBoundaries(wordList);
  const buildDisplay = useBuildDisplay(wordBoundaries);

  const restart = useCallback((duration = testDuration, wordCount = wordTarget, modeOverride) => {
    const actualMode = modeOverride || mode;
    const nWords = actualMode === "words" ? wordCount : 25;
    setWordList(pickWords(nWords));

    if (actualMode === "time") {
      setTestDuration(duration);
      setTimeLeft(duration);
    } else {
      setTestDuration(0);
      setTimeLeft(0);
    }

    setInput("");
    setStarted(false);
    setFinished(false);
    setCorrectChars(0);
    setTotalChars(0);
    setMode(actualMode);
    setWordTarget(wordCount);
  }, [mode, testDuration, wordTarget]);

  // Timer effect
  useEffect(() => {
    if (mode === "time" && started && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    } else if (mode === "time" && started && timeLeft === 0) {
      setFinished(true);
    }
    return () => clearTimeout(timerRef.current);
  }, [mode, started, timeLeft]);

  const calcStats = useCallback(() => {
    const elapsed = mode === "time" ? (testDuration - timeLeft || 1) : (started ? performance.now() : 1);
    const elapsedSeconds = mode === "time" ? elapsed : elapsed / 1000;
    const wpm = elapsedSeconds > 0 ? Math.round((correctChars / 5 / elapsedSeconds) * 60) : 0;
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : started ? 0 : 100;
    return { wpm, accuracy };
  }, [mode, testDuration, timeLeft, started, correctChars, totalChars]);

  // Input change handler
  const handleChange = useCallback(e => {
    if (finished) return;
    if (!started) setStarted(true);

    const raw = e.target.value;
    const targetText = wordList.join(" ");

    if (skipSpaces) {
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

      if (mode === "words" && typed.length >= targetNoSpaces.length) {
        setFinished(true);
      }
    } else {
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
  }, [finished, started, buildDisplay, skipSpaces, wordList, mode]);

  return {
    mode,
    setMode,
    wordTarget,
    setWordTarget,
    wordList,
    testDuration,
    timeLeft,
    input,
    started,
    finished,
    correctChars,
    totalChars,
    skipSpaces,
    setSkipSpaces,
    restart,
    handleChange,
    calcStats,
  };
}
