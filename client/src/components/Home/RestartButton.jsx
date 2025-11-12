export default function RestartButton({ restart, mode, testDuration, wordTarget }) {
  return (
    <button
      onClick={() => restart(mode === "time" ? testDuration : wordTarget)}
      className="mt-6 px-8 py-3 rounded bg-yellow-500 hover:bg-yellow-400 text-black font-bold transition"
    >
      Restart
    </button>
  );
}
