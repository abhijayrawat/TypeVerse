import { useCallback } from "react";

export default function useBuildDisplay(wordBoundaries) {
  return useCallback((typedNoSpaces) => {
    let out = "";
    for (let i = 0; i < typedNoSpaces.length; i++) {
      out += typedNoSpaces[i];
      if (wordBoundaries.current.includes(i + 1)) {
        out += " ";
      }
    }
    return out;
  }, [wordBoundaries]);
}
