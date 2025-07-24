export default function TypingDisplay({ wordList, input, finished }) {
  const targetText = wordList.join(" ");
  const inputChars = input.split("");

  return (
    <div className="w-full max-w-4xl bg-zinc-800 rounded p-6 font-mono text-xl shadow-md min-h-[120px] select-none">
      {targetText.split("").map((char, idx) => {
        let style = "inline-block";

        if (inputChars[idx]) {
          style += inputChars[idx] === char ? " text-yellow-400" : " text-red-500 bg-red-900/40";
        } else if (!inputChars[idx] && idx === inputChars.length && !finished) {
          style += " underline decoration-yellow-400 animate-pulse";
        } else {
          style += " text-zinc-400";
        }

        return (
          <span key={idx} className={style}>
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}
    </div>
  );
}
