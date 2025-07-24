import TypingDisplay from "./TypingDisplay";

export default function TypingArea({ wordList, input, handleChange, finished }) {
  return (
    <>
      <TypingDisplay wordList={wordList} input={input} />
      <textarea
        className="mt-8 w-full max-w-4xl h-28 bg-zinc-800 p-4 rounded font-mono text-lg outline-none resize-none"
        value={input}
        onChange={handleChange}
        disabled={finished}
        placeholder="Start typing…"
        autoFocus
      />
    </>
  );
}
