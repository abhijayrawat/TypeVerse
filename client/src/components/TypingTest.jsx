import React from "react";
import useTypingTest from "../hooks/useTypingTest";
import useSaveResult from "../hooks/useSaveResult";

import ModeSelector from "./ModeSelector";
import DurationSelector from "./DurationSelector";
import TypingArea from "./TypingArea";
import StatsPanel from "./StatsPanel";
import RestartButton from "./RestartButton";
import FinishedSummary from "./FinishedSummary";

export default function TypingTest() {
  const {
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
    skipSpaces,
    setSkipSpaces,
    restart,
    handleChange,
    calcStats,
  } = useTypingTest();

  const stats = calcStats();

  useSaveResult(finished, {
    mode,
    testDuration,
    wordList,
    stats,
  });

  return (
    <div className="flex flex-col items-center min-h-screen bg-zinc-900 text-white pt-20 p-6">
      <h1 className="text-4xl font-mono font-bold mb-8">TypeVerse</h1>

      <ModeSelector mode={mode} setMode={setMode} started={started} restart={restart} />

      <DurationSelector
        mode={mode}
        testDuration={testDuration}
        wordTarget={wordTarget}
        skipSpaces={skipSpaces}
        setSkipSpaces={setSkipSpaces}
        started={started}
        restart={restart}
      />

      <StatsPanel
        wpm={stats.wpm}
        accuracy={stats.accuracy}
        timeLeft={mode === "time" ? timeLeft : null}
      />

      <TypingArea wordList={wordList} input={input} handleChange={handleChange} finished={finished} />

      <RestartButton restart={restart} mode={mode} testDuration={testDuration} wordTarget={wordTarget} />

      {finished && (
        <FinishedSummary
          stats={stats}
          mode={mode}
          testDuration={testDuration}
          timeLeft={timeLeft}
          wordList={wordList}
        />
      )}
    </div>
  );
}
