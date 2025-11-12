import React, { useState, useContext, useCallback, useMemo, useEffect, useRef } from "react";

import { AuthContext } from "../../context/AuthContext";
import TypingDisplay from "./TypingDisplay";
import TypingArea from "./TypingArea";
import StatsPanel from "./StatsPanel";
import ModeSelector from "./ModeSelector";
import DurationSelector from "./DurationSelector";
import RestartButton from "./RestartButton";
import FinishedSummary from "./FinishedSummary";
import SoundToggle from "./SoundToggle";
import useTypingTest from "../../hooks/useTypingTest";
import useSaveResult from "../../hooks/useSaveResult";

export default function TypingTest() {
  const { token } = useContext(AuthContext);
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
    correctChars,
  } = useTypingTest();

  const stats = useMemo(() => calcStats(), [calcStats]);
  const [muted, setMuted] = useState(false);

  useSaveResult(finished, { mode, testDuration, wordList, stats, token });

  // Callback to check if last typed character was correct
  const onKeyPressResult = useCallback(
    (char) => {
      if (!char) return true;
      if (skipSpaces) {
        const typedNoSpaces = input.replace(/\s/g, "");
        const idx = typedNoSpaces.length;
        const targetNoSpaces = wordList.join(" ").replace(/\s/g, "");
        return targetNoSpaces[idx - 1] === char;
      } else {
        const idx = input.length;
        const target = wordList.join(" ");
        return target[idx - 1] === char;
      }
    },
    [input, wordList, skipSpaces]
  );

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-zinc-900 text-white pt-20 p-6">

      {/* <h1 className="text-4xl font-mono font-bold mb-8">TypeVerse</h1> */}

      <ModeSelector mode={mode} setMode={setMode} started={started} restart={restart} />

      

      <div className="relative w-full flex justify-center mb-6 select-none">
         <div className="absolute left-1/2 transform -translate-x-1/2">
  <DurationSelector
    mode={mode}
    testDuration={testDuration}
    wordTarget={wordTarget}
    skipSpaces={skipSpaces}
    setSkipSpaces={setSkipSpaces}
    started={started}
    restart={restart}
  />
  </div>
  <div className="ml-auto">
    <SoundToggle muted={muted} setMuted={setMuted} />
  </div>
</div>


  <StatsPanel wpm={stats.wpm} accuracy={stats.accuracy} timeLeft={mode === "time" ? timeLeft : null} />


      <TypingDisplay wordList={wordList} input={input} />

      <TypingArea
        wordList={wordList}
        input={input}
        handleChange={handleChange}
        finished={finished}
        onKeyPressResult={onKeyPressResult}
        muted={muted}
      />

      <RestartButton restart={restart} mode={mode} testDuration={testDuration} wordTarget={wordTarget} />

      {finished && (
        <FinishedSummary stats={stats} mode={mode} testDuration={testDuration} timeLeft={timeLeft} wordList={wordList} />
      )}
    </div>
  );
}
