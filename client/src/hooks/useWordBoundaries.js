import { useEffect, useRef } from "react";

export default function useWordBoundaries(wordList) {
  const wordBoundaries = useRef([]);

  useEffect(() => {
    let cum = 0;
    const boundaries = [];
    for (const w of wordList) {
      cum += w.length;
      boundaries.push(cum);
    }
    wordBoundaries.current = boundaries;
  }, [wordList]);

  return wordBoundaries;
}
