import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

export default function SoundToggle({ muted, setMuted }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-xs text-zinc-400 uppercase tracking-widest">
        Sound
      </span>

      <motion.button
        onClick={() => setMuted((prev) => !prev)}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
        className={`relative mt-2 flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 shadow-md ${
          muted
            ? "bg-red-500/20 text-red-500 hover:bg-red-500/30"
            : "bg-green-500/20 text-green-500 hover:bg-green-500/30"
        }`}
        title={muted ? "Unmute Sound" : "Mute Sound"}
      >
        <AnimatePresence mode="wait" initial={false}>
          {muted ? (
            <motion.div
              key="muted"
              initial={{ rotate: -30, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 30, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <VolumeX size={30} />
            </motion.div>
          ) : (
            <motion.div
              key="unmuted"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Volume2 size={30} />
              {/* Glow pulse when active */}
              <motion.div
                className="absolute inset-0 rounded-full bg-green-400/20"
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.3, 0, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
