export default function ModeSelector({ mode, setMode, started, restart }) {
  return (
    <div className="flex gap-4 mb-4">
      <button
        className={`px-4 py-2 font-semibold rounded-full transition ${
          mode === "time" ? "bg-yellow-500 text-black" : "bg-zinc-800 hover:bg-zinc-700"
        }`}
        onClick={() => {
          if (!started) {
            setMode("time");
            restart(15, undefined, "time");
          }
        }}
        disabled={started}
      >
        Timed Mode
      </button>
      <button
        className={`px-4 py-2 font-semibold rounded-full transition ${
          mode === "words" ? "bg-yellow-500 text-black" : "bg-zinc-800 hover:bg-zinc-700"
        }`}
        onClick={() => {
          if (!started) {
            setMode("words");
            restart(undefined, 10, "words");
          }
        }}
        disabled={started}
      >
        Fixed-Word Mode
      </button>
    </div>
  );
}
