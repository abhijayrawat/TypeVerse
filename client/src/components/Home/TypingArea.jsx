import React, { useRef, useEffect } from "react";

export default function TypingArea({
  input,
  handleChange,
  finished,
  muted,
  wordList,
}) {
  const wrongAudioRef = useRef(null);

  useEffect(() => {
    wrongAudioRef.current = new Audio("/wrong.mp3");
    wrongAudioRef.current.volume = 0.3;
  }, []);

  const onKeyDown = (e) => {
    if (finished) return;

    const char = e.key.length === 1 ? e.key : "";
    if (!char) return;

    const expectedChar = wordList.join(" ").charAt(input.length);

    if (char !== expectedChar && !muted && wrongAudioRef.current) {
      try {
        wrongAudioRef.current.currentTime = 0;
        wrongAudioRef.current.play();
      } catch (err) {
        // ignore autoplay restrictions
      }
    }
  };

  return (
    <textarea
      className="mt-8 w-full max-w-4xl h-28 bg-zinc-800 p-4 rounded font-mono text-lg outline-none resize-none"
      value={input}
      onChange={handleChange}
      onKeyDown={onKeyDown}
      disabled={finished}
      placeholder="Start typing…"
      autoFocus
    />
  );
}
