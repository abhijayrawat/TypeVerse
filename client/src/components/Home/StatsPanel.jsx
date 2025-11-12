export default function StatsPanel({ wpm, accuracy, timeLeft }) {
  return (
    <div className="flex justify-center gap-16 mb-6 select-none">
      <div className="flex flex-col items-center">
        <span className="text-xs text-zinc-400 uppercase">WPM</span>
        <span className="text-3xl font-bold text-yellow-400">{wpm}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-xs text-zinc-400 uppercase">Accuracy</span>
        <span className="text-3xl font-bold text-green-400">{accuracy}%</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-xs text-zinc-400 uppercase">Time Left</span>
        <span className="text-3xl font-bold">{timeLeft}s</span>
      </div>
    </div>
  );
}
