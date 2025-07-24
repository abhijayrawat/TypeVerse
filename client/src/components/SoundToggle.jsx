export default function SoundToggle({ muted, setMuted }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-xs text-zinc-400 uppercase">Sound</span>
      <button
        onClick={() => setMuted((prev) => !prev)}
        className="text-3xl mt-1 transition"
        title="Toggle Sound"
      >
        {muted ? "🔇" : "🔊"}
      </button>
    </div>
  );
}
