import { useState, useEffect, useRef, useCallback } from "react";
import pickWords from "../utils/pickWords";
import useWordBoundaries from "../hooks/useWordBoundaries";
import useBuildDisplay from "../hooks/useBuildDisplay";

export default function useTypingTest(
  initialMode = "time",
  initialDuration = 15,
  initialWordCount = 25
) {
  // Core states
  const [mode, setMode] = useState(initialMode); // "time" or "words"
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

  // Start and finish timestamps for accurate WPM in fixed-word mode
  const [startTime, setStartTime] = useState(null);
  const [finishedTime, setFinishedTime] = useState(null);

  const timerRef = useRef(null);

  // Hooks for boundary detection & display formatting
  const wordBoundaries = useWordBoundaries(wordList);
  const buildDisplay = useBuildDisplay(wordBoundaries);

  // Restart the test: reset state, generate new words, reset timer
  const restart = useCallback(
    (duration = testDuration, wordCount = wordTarget, modeOverride) => {
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

      setStartTime(null);
      setFinishedTime(null);
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [mode, testDuration, wordTarget]
  );

  // Timer countdown effect (only for timed mode)
  useEffect(() => {
    if (mode !== "time" || !started || timeLeft <= 0) return;

    timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);

    if (timeLeft === 1) {
      setFinished(true);
      setFinishedTime(Date.now());
    }

    return () => clearTimeout(timerRef.current);
  }, [mode, started, timeLeft]);

  // Calculate WPM and accuracy
  const calcStats = useCallback(() => {
    let elapsedSeconds;

    if (mode === "time") {
      elapsedSeconds = testDuration - timeLeft || 1;
    } else {
      if (startTime && finishedTime) {
        elapsedSeconds = (finishedTime - startTime) / 1000;
      } else if (startTime) {
        elapsedSeconds = (Date.now() - startTime) / 1000;
      } else {
        elapsedSeconds = 1; // fallback
      }
    }

    const wpm =
      elapsedSeconds > 0
        ? Math.round((correctChars / 5 / elapsedSeconds) * 60)
        : 0;
    const accuracy =
      totalChars > 0
        ? Math.round((correctChars / totalChars) * 100)
        : started
        ? 0
        : 100;

    return { wpm, accuracy };
  }, [mode, testDuration, timeLeft, correctChars, totalChars, started, startTime, finishedTime]);

  // Input handler
  const handleChange = useCallback(
    (e) => {
      if (finished) return;

      const raw = e.target.value;
      const targetText = wordList.join(" ");

      if (!started) {
        setStarted(true);
        setStartTime(Date.now());
      }

      if (skipSpaces) {
        // Remove spaces typed by user
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

        // Finish test automatically if all words typed
        if (mode === "words" && typed.length >= targetNoSpaces.length) {
          setFinished(true);
          if (!finishedTime) setFinishedTime(Date.now());
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
          if (!finishedTime) setFinishedTime(Date.now());
        }
      }
    },
    [finished, started, buildDisplay, skipSpaces, wordList, mode, finishedTime]
  );

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
